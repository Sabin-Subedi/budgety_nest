import axios from 'axios';
import fs from 'fs';

const vaultToken = process.env.VAULT_TOKEN;
console.log('VAULT_TOKEN', vaultToken);

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
    fs.writeFileSync(`./.env`, ``);
    for (let key in envData) {
      fs.appendFileSync(`./.env`, `\n${key}="${envData[key]}"`);
    }
  } catch (err) {
    throw new Error(err);
  }
})();
