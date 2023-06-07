/**
 * {}
 * @author yutent<yutent.io@gmail.com>
 * @date 2023/06/07 18:01:50
 */

import Five from '@gm5/core'
import fs from 'iofs'

const app = new Five()

if (fs.isfile('./config.env')) {
  //
  fs.cat('./config.env')
    .toString()
    .split('\n')
    .forEach(it => {
      let tmp = it.trim()
      if (tmp) {
        tmp = tmp.split(': ')
        process.env[tmp[0]] = tmp[1]
      }
    })
}

app.set({
  token: process.env.GITHUB_TOKEN
})

app.preload('./apps/')

app.listen(23333)
