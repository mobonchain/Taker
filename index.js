import axios from 'axios';
import { ethers } from 'ethers';
import fs from 'fs';
import log from './config/logger.js';
import banner from './config/banner.js';
import contract from './config/contract.js';
import { HttpsProxyAgent } from 'https-proxy-agent';


function readWallets() {
   if (fs.existsSync('wallets.json')) {
      const data = fs.readFileSync('wallets.json');
      return JSON.parse(data);
   } else {
      log.error('No wallets found in wallets.json. Exiting');
      process.exit(1);
   }
}

// Đọc proxy từ proxy.txt
function readProxies() {
   if (fs.existsSync('proxy.txt')) {
      const data = fs.readFileSync('proxy.txt', 'utf-8');
      return data.split('\n').map((proxy) => proxy.trim()).filter(Boolean);
   } else {
      log.error('No proxies found in proxy.txt. Exiting');
      process.exit(1);
   }
}

const API = 'https://lightmining-api.taker.xyz/';

// Lấy danh sách proxy
const proxies = readProxies();

// Tạo một instance axios có cấu hình proxy cho từng ví
const baseURL = axios.create({
   baseURL: API,
});

const get = async (url, token, proxy) => {
   const agent = new HttpsProxyAgent(proxy);
   return await baseURL.get(url, {
      headers: {
         Authorization: `Bearer ${token}`,
      },
      httpsAgent: agent,
   });
};

const post = async (url, data, config = {}, proxy) => {
   const agent = new HttpsProxyAgent(proxy);
   return await baseURL.post(url, data, {
      ...config,
      httpsAgent: agent,
   });
};

const sleep = (s) => {
   return new Promise((resolve) => setTimeout(resolve, s * 1000));
};

// Hàm ký tin nhắn
async function signMessage(message, privateKey) {
   const wallet = new ethers.Wallet(privateKey);
   try {
      const signature = await wallet.signMessage(message);
      return signature;
   } catch (error) {
      log.error('Error signing message:', error);
      return null;
   }
}

// Lấy nonce cho ví
const getNonce = async (walletAddress, proxy, retries = 3) => {
   try {
      const res = await post('wallet/generateNonce', { walletAddress }, {}, proxy);
      return res.data;
   } catch (error) {
      if (retries > 0) {
         log.error('Failed to get nonce:', error.message);
         log.warn(`Retrying... (${retries - 1} attempts left)`);
         await sleep(3);
         return await getNonce(walletAddress, proxy, retries - 1);
      } else {
         log.error('Failed to get nonce after retries:', error.message);
         return null;
      }
   }
};

// Hàm login tài khoản
const loginAcc = async (address, message, signature, proxy, retries = 3) => {
   try {
      const res = await post('wallet/login', { address, message, signature }, {}, proxy);
      return res.data.data;
   } catch (error) {
      if (retries > 0) {
         log.error('Failed to login:', error.message);
         log.warn(`Retrying... (${retries - 1} attempts left)`);
         await sleep(3);
         return await loginAcc(address, message, signature, proxy, retries - 1);
      } else {
         log.error('Failed to login after retries:', error.message);
         return null;
      }
   }
};

// Đọc và xử lý thông tin người dùng
const getUser = async (token, proxy, retries = 3) => {
   try {
      const response = await get('user', token, proxy);
      return response.data;
   } catch (error) {
      if (retries > 0) {
         log.error('Failed to get user data:', error.message);
         log.warn(`Retrying... (${retries - 1} attempts left)`);
         await sleep(3);
         return await getUser(token, proxy, retries - 1);
      } else {
         log.error('Failed to get user data after retries:', error.message);
         return null;
      }
   }
};

const startMine = async (token, proxy, retries = 3) => {
   try {
      const res = await post('assignment/startMining', {}, { headers: { Authorization: `Bearer ${token}` } }, proxy);
      return res.data;
   } catch (error) {
      if (retries > 0) {
         log.error('Failed to start mining:', error.message);
         log.warn(`Retrying... (${retries - 1} attempts left)`);
         await sleep(3);
         return await startMine(token, proxy, retries - 1);
      } else {
         log.error('Failed to start mining after retries:', error.message);
         return null;
      }
   }
};

const getMinerStatus = async (token, proxy, retries = 3) => {
   try {
      const response = await get('assignment/totalMiningTime', token, proxy);
      return response.data;
   } catch (error) {
      if (retries > 0) {
         log.error('Failed to get user mine data:', error.message);
         log.warn(`Retrying... (${retries - 1} attempts left)`);
         await sleep(3);
         return await getMinerStatus(token, proxy, retries - 1);
      } else {
         log.error('Failed to get user mine data after retries:', error.message);
         return null;
      }
   }
};

// Main logic
const main = async () => {
   log.info(banner);
   const wallets = readWallets();
   if (wallets.length === 0) {
      log.error('No wallets found in wallets.json');
      process.exit(1);
   }

   let proxyIndex = 0; // Biến để chỉ mục proxy

   while (true) {
      log.info(`Starting all wallets:`, wallets.length);

      for (const wallet of wallets) {
         const proxy = proxies[proxyIndex];
         if (!proxy) {
            log.error('Out of proxies');
            return;
         }

         const nonceData = await getNonce(wallet.address, proxy);
         if (!nonceData || !nonceData.data || !nonceData.data.nonce) {
            log.error(`Failed to retrieve nonce wallet: ${wallet.address}`);
            continue;
         }

         const nonce = nonceData.data.nonce;
         const signature = await signMessage(nonce, wallet.privateKey);
         if (!signature) {
            log.error(`Failed sign message wallet: ${wallet.address}`);
            continue;
         }
         log.info(`Login wallet: ${wallet.address}`);
         const loginResponse = await loginAcc(wallet.address, nonce, signature, proxy);
         if (!loginResponse || !loginResponse.token) {
            log.error(`Login failed wallet: ${wallet.address}`);
            continue;
         } else {
            log.info(`Login successful...`);
         }

         log.info(`Try to check user info...`);
         const userData = await getUser(loginResponse.token, proxy);
         if (userData && userData.data) {
            const { userId, twName, totalReward } = userData.data;
            log.info(`User Info:`, { userId, twName, totalReward });
            if (!twName) {
               log.error('', `This wallet (${wallet.address}) is not bound Twitter/X skipping...`);
               continue;
            }
         } else {
            log.error(`Failed to get user data wallet: ${wallet.address}`);
         }

         log.info('Try to check user miner status...');
         const minerStatus = await getMinerStatus(loginResponse.token, proxy);
         if (minerStatus && minerStatus.data) {
            const lastMiningTime = minerStatus.data?.lastMiningTime || 0;
            const nextMiningTime = lastMiningTime + 24 * 60 * 60;
            const nextDate = new Date(nextMiningTime * 1000);
            const dateNow = new Date();

            log.info(`Last mining time:`, new Date(lastMiningTime * 1000).toLocaleString());
            if (dateNow > nextDate) {
               log.info(`Try to start Mining wallet: ${wallet.address}`);
               const mineResponse = await startMine(loginResponse.token, proxy);
               log.info('Mine response:', mineResponse);
               if (mineResponse) {
                  log.info(`Try to activate mining on-chain wallet: ${wallet.address}`);
                  const isMiningSuccess = await contract(wallet.privateKey);
                  if (!isMiningSuccess) {
                     log.error(`Failed to activate mining or wallet dont have taker balance`);
                  }
               } else {
                  log.error(`Failed to start mining wallet: ${wallet.address}`);
               }
            } else {
               log.warn(`Mining already, next mining time is:`, nextDate.toLocaleString());
            }
         }

         proxyIndex = (proxyIndex + 1) % proxies.length; // Chuyển sang proxy tiếp theo
      }

      log.info('All wallets processed delay 1 hour');
      await sleep(60 * 60);
   }
};

main();
