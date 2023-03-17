import mobsZh from './../data/mob-id-name-zh_tw.json' assert {type: 'json'};
import mariadb from 'mariadb'

async function main () {
  const sqlUpdatePairs = mobsZh.map(mob => {
    return [mob.name_zh_tw, mob.id]
  })

  const pool = mariadb.createPool({ 
    host: 'localhost',
    port: '3306', 
    user:'root',
    database: 'ro-zh_tw'
  });
  
  let conn;
  try {
    conn = await pool.getConnection();
    console.log("connected ! connection id is " + conn.threadId);

    const res = await conn.batch('UPDATE mob_db SET name_japanese=? WHERE id=?', sqlUpdatePairs);


  console.log('res', res)

    await conn.release(); //release to pool
  } catch (err) {
    console.log("not connected due to error: " + err);
  }
}

await main()

process.exit(0);
