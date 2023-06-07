/**
 * {}
 * @author yutent<yutent.io@gmail.com>
 * @date 2023/06/07 18:06:57
 */

import Controller from '@gm5/controller'
import { render } from '../lib/svg.js'

export default class Github extends Controller {
  __main__() {
    //
  }

  async toplangsAction() {
    let { username, count = 6 } = this.request.get()
    let token = this.context.get('token')

    let { data } = await fetch('https://api.github.com/graphql', {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({
        query: `
query {
  repositoryOwner(login: "${username}") {
    repositories(ownerAffiliations: [OWNER, ORGANIZATION_MEMBER], isFork: false, first: 100){
      nodes {
        name
        languages(first: 10) {
          edges {
            size
            node {
              color
              name
            }
          }
        }
      }
    }
  }
}
    `
      })
    }).then(r => r.json())

    let { nodes } = data.repositoryOwner.repositories
    let dict = {}
    let langs = []

    nodes.forEach(it => {
      for (let lang of it.languages.edges) {
        if (dict[lang.node.name]) {
          dict[lang.node.name].size += lang.size
        } else {
          dict[lang.node.name] = { size: lang.size, color: lang.node.color }
        }
      }
    })

    for (let k in dict) {
      langs.push({ name: k, size: dict[k].size, color: dict[k].color })
    }

    langs.sort((a, b) => b.size - a.size)

    this.response.set('Content-Type', 'image/svg+xml')
    this.response.end(render({}))

    // this.response.send(200, { langs: langs.slice(0, count) })
  }
}
