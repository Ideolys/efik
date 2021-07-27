

<img src="doc/efik-logo.png" alt="image-20210221093318545" style="zoom:33%;" />



> Extremely Efficient, Keen, Light and Future-proof (~ vanilla AMAP) full-feature web framework



# ⚡️ Philosophy

- **ZERO breaking** changes for the **next 10 years**. Our mission is to be a **fatigue-js antidote** 💉
- The first javascript framework which really **cares about your company's ROI** . Your CEO / CTO will love it 😍 .
- battery-included: fast  **~400 lines of code** replacement of `mocha`, `request`, `pg`, `lru-cache`, `debug`, `redis`, 
- Developed in simple `Javascript` like in `c` . 
- 🖕**pre-optimized** everything, because later is too late
- Built-in **job queue management** (for big query) with history and management screen (websocket notification for result)
- **Secured** by default, no SQL injection guarantee by design, best-practice PostgteSQL user management
- **fast**  `npm install`  , **small** `node_modules` , **easy** to deploy with one executable and systemd
- almost **no-dependencies** (only uWebSocket?)

- Low magic at runtime. Almost Vanilla code. Do magic in maintenance & scaffolding tools 
- **extremly** **high** **performance** in all domain (client, server, test, doc, restart...). TOP-3 in all benchmarks
- fast learning curve
- Optimized only for PostgreSQL, TimescaleDB only but can be used **without DB**
- Good for:
  - SPA
  - big ERPs with 1000 APIs, 400 tables, etc...
  - small micro-services
  - static-site (?)
  - website with SSR
- Inspired by
  - pg driver & simple queries https://github.com/porsager/postgres
  - static-it 
  - riot-js, for small client side-app,
  - svelte
- can be used with VueJS, React, Lunaris, etc...
- We can include the framework without using PostgreSQL (just for using mocha for example ;) )
- Separate PG user (schema and data), et générer MDP de PG avec un hash de l'app key ?

### Server

- **One JSON API = One SQL query/transaction**

- **No ORM** (Object-relational mapping), the database is your model. Do not repeat yourself. Developer must keep control on SQL. Database-centric approach. 
- **High performance / High availability / High security ** at all stages: runtime, during development, deployment, testing, DB migrations, and migrations of tests datasets. It means also automatic CRUD code generation, test generation, documentation, automatic audit  tool: SQL cache hit ratio metrics,  bad SQL (a query with multiple joins to the same table), automatic clean/indentation of complex Pg SQL code. Connects to multiple database to let the developer execute some API on a secondary PostgreSQL server. Pre-configured and compatible with PG Logical Replication (pgLogical 2) or Full Replication.
- **Almost** no-dependency. But stay compatible with middleware eco-system `(req, res, next)`

### Client (BONUS)

- Includes a simple client-side framework

- Almost **Vanilla** : use native JS as much as possible (Web Component)

- **High performance** 

- Extremely fast builder

  

# 🚀 Getting-started

Start a new project

```bash
efik init
```

Genarate a basic example to CRUD users, with authentication:

```bash
efik init example-user
```

```
| config/
| server/
  | api/
    | user/
      | test/
      | user.js
      | create.sql
      | update.sql
      | list.sql
  | api/
| client/
| assets/
```

TODO, à compléter : 

```javascript
module.exports = {
  schema : {
    sql      : 'list.sql',
    validate : false,
    map      : [{
      id    : ['<<id'                     ],
      label : ['string', 'min', 1, '<label'],
      extId : ['<extId']
    }]
  },

  scenario : {
    create : function (schema) {
      schema.map = schema.map[0];
      schema.map._id = ['<<_id>>'];
      schema.defaultSort = ['_id', 'label'];
      schema.sql = 'create.sql';
      schema.validate = true;
      return schema;
    },
    update : function (schema) {
      schema.map = schema.map[0];
      schema.map._id = ['<<_id>>'];
      schema.defaultSort = ['_id', 'label'];
      schema.sql = 'update.sql';
      // schema.beforeValidate = beforeUpdate;
      // schema.validate = true;
      return schema;
    },
    destroy : function (schema) {
      schema.map = schema.map[0];
      schema.sql = 'destroy.sql';
      return schema;
    },
    listForSupplierPortal : function (schema) {
      return schema;
    },
  },

  init : function (srv) {
    // idée à valider : 
    // Trouver comment déclairer l'API en y ajoutant des options :
    //  rate-limit, redirection sur serveur secondaires si disponible car grosse requête
    //  penser à la gestion des droit (regroupement) et documentation qui doit se générer toute seule
    
    srv.use(rateLimit(122));
    srv.use(db(122));
    srv.use(before(122));
    
    srv.get('/allergens', before(), transform('default'), desc('sdsd'))
    srv.get( '/allergens'             , 'Get the list of allergen of a site' , 'default');

    srv.use(rateLimit(122));
    srv.post('/allergens'             , 'Create a allergen'                  , 'create' ).use(rateLimi(11));

    srv.put( '/allergens/:idAllergen' , 'Update a allergen'                  , 'update' );
    srv.del( '/allergens/:idAllergen' , 'Delete a allergen'                  , 'destroy');
    srv.get('/supplier-portal/:siret/allergens', 'Get the list of allergens for a supplier', 'listForSupplierPortal');

    srv.use(response);
  }

};
```







## 💎 Why database-centric approach?

- **Faster**: Avoid useless data-transfer between databases and application servers. Everything (filtering, grouping, sum...) is done as close as possible to the data, directly in the database, directly in SQL.
- **No limit**: Relational databases are extremely powerful and under-used most of the time. *Read the fucking manual* of your database before choosing a NoSQL alternative, or some other tools (Full Text Search, ...). NoSQL is not a panacea. Moreover, PostgreSQL have a lot of NoSQL features and is faster if configured properly. There are even PostgreSQL forks with Shared-Nothing architectures. 
- **ACID** (Atomicity, Consistency, Isolation, Durability): each HTTP request is a database transaction
- **Long-term** business logic: SQL is a solid language and can be used by your clients!
- **Reliable**: Memory management is complex, let your database doing most of the work. Reduce javascript code, reduce memory leaks and hazardous execution paths.
- **Simple** stack: Thin application server, the non-blocking IO model of NodeJS is perfect for that.
- **Experience**: It works in production since 2011 on a big application (more than 500 APIs, 150 tables, millions of rows, ...) by FTSE 100 companies.





## ⚡️ Vision et developpement



**Ligne conductrice** : Faire en sorte que la migration  vers efik soit extrêmement rapide. Faire plus avec moins de code :) 

**Objectifs** : Par rapport à actuellement : gagner en sécu, perf, doc, log, et simplicité. On doit notamment résoudre ces grands problèmes:

- l'invalidation du cache (résolution dépendance SQL)
- la réparition de charge sur plusieurs BDD pour exploiter une BDD slave (lecture seule) si dispo
- la gestion des file d'attente pour les grosse requête avec résultat asynchrone (websocket) pour les calcul de besoin, etc...
- la sécurité avec un système de POLICY simple, inspiré des POLICY de Postgres mais plus performant car pas appliqué sur toute la requête pour limiter l'accès  au Tenant sans que le développeur ait besoin d'y penser, sauf au moment où il décrit le modèle.
- catcher les erreur PG et les traduire proprement pour retourner un message plus clair au client (CONSTRAINT FOREIGN KEY CategoryMenu_Site ->   Impossible d'effacer le menu car des Sites liée, ...  )
- En prod : plus de forever, juste systemd,  et un exéctable très légé, qui démarre instantément 
- ne plus avoir besoin de coder le CRUD des API simple. Ca génère le code, et le rêve serait de fusionner avec les modif SQL custom du développeur pour par exemple ajouter un champ dans une table, y comprit les tests. On a plein de bout de code qui gère un début de tout ça (remettre en route le datasetManager, génération d'API, ...)



**Quelques grandes étapes de dev:**

- [ ] Travailler directement avec Node16. Essayer d'être compatible `Promise` sans allourdir le code. A mon avis, faut rester callback-first pour des question de perf (la base du JS) et promisifier pour laisser le choix au user final.
- [ ] Avoir dès le départ des benchmark facile à lancer de toutes les couches. Ca doit cracher et on doit le prouver et le vérifier à chaque évol 😛
- [ ] redévélopper une version simple de Mocha sans dépendance. J'ai commencé un début mais tout le monde peut le reprendre. Nouveauté par rapport à actuellement : 
  - [ ] plus rapide, supportant le multithread : Si on lance l'appli, connecté à plusieurs base de données, les tests sont découpé en grande tranche et exécuté dans chaque thread sur plusieurs DB indépendante ? A voir quelle est la meilleure méthode mais il faut qu'on trouve un truc pour multi-threader ces tests et divider le temsp d'exécution au maximum.
  - [ ] rappatrier dans efik et simplifier la gestion des transaction PG, effacemenrt DB, etc... (comme actuellement) afin d'avoir des tests ultra rapide, en diminuant les injection de dataset (si 2 tests utilisent le même dataset, on évite de ré-insérer 2 fois, comme actuellement)
  - [ ] trouver un moyen de tester en grande partie les API CRUD de manière automatique ? Dnas l'idée, je verrai bien un générateur de test bourrin qui essaye "tout" sur une API et fait un rapport de l'état de l'API (sécu, ..)
  - [ ] développé les "helper d'assert" juste nécessaire pour tester sans perdre en perf. Garder l'équivalent de hepler.assert (rapide, simple) qui check le type et la donnée. Et ajouter peut-être quelque truc pratique de `should` (un objet inclut dans un autre indépendamment de l'ordre ? , checker une date ou un nombre de manière approximative ? ) mais en plus performant. A la fin, un dev doit avoir seulement 3 ou 4 ligne de commande à retenir pour faire un assert, pas beaucoup plus. 
- [ ] David a plein de code déjà fait: Gérer le déploiement avec PKG, et les ligne de commande start, stop, ... Garder le fait que le thread Master ne fait quasiment rien. J'ai testé avec GoHA, on peut gérer un update de Node sans coupure (le master reste dans un node ancien) mais il faut que le Master soit quasi vide et gère que le threading, les signaux de restart, relaod, ... log comme GoHA. Dans GoHA, j'ai pas tout commit, il y a un morceau inspiré de https://blog.dashlane.com/implementing-nodejs-http-graceful-shutdown/  qui arrive
- [ ] Gérer un server HTTP express-like mais sans express avec du pur JS et peut-être just ce qu'il faut pour que trouver la route avec un index efficace (on n'a pas besoin d'avoir des regexp compliqué dans les desccription des routes). Certains utilisent directement uWebsocket pour gérer aussi la partie HTTP afin de booster le tout. S'inspirer de 
  - [ ] https://github.com/nanoexpress/nanoexpress
  - [ ] https://sifrr.github.io/sifrr/#/./packages/server/sifrr-server/
  - [ ] -> benchmark https://web-frameworks-benchmark.netlify.app/result
- [ ] Avoir un équivalent de `request`  en plus léger comme `httpclient`  actuellement. Je crois que c'est déjà bien mais il manque peut-être la gestion de la compression et des redirections (cf ce que supporte https://github.com/feross/simple-get )
- [ ] Essayer d'avoir avoir un sytème de rate-limit ultra efficace  et simple n'utilsant pas setTimeout pour éviter de peter la stack.  Sans utiliser de dep compilé en C comme celui de Crisp (chiant à PKG), qui me parait bizarre car il repose à la fin sur des setTimeout. En utilisant un variant de kitten-cache ?, ...
- [ ] Supprimer Redis. Efik doit avoir son propre système de cache (qu'il a déjà en grande partie). Faut-il lui ajouter un moyen de "poser" le cache sur le disque pour un fast-restart ?
- [ ] Charger les API via module.export pour pour avoir accès à l'objet dès le require,  éviter d'écouter l'appel à "xxx.api.define", ça génère énormément de complexité pour rien
  - [ ] Bonus, avoir un systèeme de webhook built-in ? pour nos client. Tu t'abonne à une API, et tu reçoit tous les POST effectué ?
- [ ] Rendre le chargement des API et décorticage des requête SQL asynchrone, de façon a avoir un démarrage ultra rapide. Charger les API à la demande (si pas d'appel de l'API, on ne parse pas le SQL). Ca devrait diminuer la conso mémoire aussi car tous les client utilise pas tout.
- [ ] S'insiprer le code du driver https://github.com/porsager/postgres  et garder l'essentiel et les bonnes idées comme le fait d'utiliser le templating ES6  `sql'SELECT ${maVariableInjecté}'`    à la place du `db.query`  
- [ ] Garder le système de gestion de config. Voir si on peut faire plus simple. Voir si on peut éviter de faire des chose dans le process Master. Accepter aussi de recevoir les variable de conf par environnement (docker). S'inspirer de Carbone-EE.
- [ ] Garder le système de queue SQL intelligente
- [ ] Avoir un Worker qui s'occupe des tâches annexe (qui ne recçoit pas de requête) : job queue, config, ... ?
- [ ] Au niveau des log, s'appuyer sur systemd
- [ ] Garder le système de migration
- [ ] Garder grossomodo le même système de templating SQL (SELECT) mais il faudrait refaire une liste des défaut actuel pour voir commen améliorer et simplifier encore. Pour la migration, de toute façon, on est obgligé de garder 99% de l'actuel. Truc à rajouter dans le syntax de mémoire : 
  - [ ] Accès aux constante simplement sans devoir faire un middleware : {{CONSTANT.BLA}} ...
  - [ ] Accès aux valeur par défaut d'une tabel dans PG {{MaTable.MaColonne.DEFAULT_VALUE}} pour éviter de dupliquer le code. Si on change la valeur par défaut, dans le schéma, on n'a pas besoin de changer dans le code.
- [ ] Garder le nouveau parsing SQL qui gère mieux les erreurs (à améliorer -> DavidG)
- [ ] CRUD automatique, avec création des tests
- [ ] Avoir un sytème générique qui synchronise une liste d'objet versionné (Git) dans une table de la BDD. En fait, on l'a redévélelopper plein de fois pour les report, cube, action, pages, ... Je me demande si on ne devrait pas fournir un outil standard mais c'est pas urgent
- [ ] Garder l'outil datasetManager et gérer les inclusion de template.







