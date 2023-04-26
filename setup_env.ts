import axios from 'axios';
import * as fs from 'fs';

const vaultToken = process.env.VAULT_TOKEN;

(async () => {
  try {
    if (!vaultToken) throw new Error('VAULT_TOKEN not found in env');
    const { data: env } = await axios.get(
      'https://vault.sabin-subedi.me/v1/budgety/data/production',
      {
        headers: {
          'X-Vault-Token': vaultToken,
          'X-Vault-Request': true,
        },
      },
    );
    const envData = env?.data?.data;
    let envString = '';

    for (const key in envData) {
      envString += `${key}=${envData[key]}\n`;
    }
    fs.writeFileSync(`.env`, envString);
  } catch (err) {
    throw new Error(err.message || err);
  }
})();
