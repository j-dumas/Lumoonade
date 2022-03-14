# Cryptool

## Fichiers de configurations

Les fichiers de configuration sont disponibles dans le dossier `env`.
Les variables nécessaires (exemples de valeurs):
| Variable | Valeur | Description |
|------------------------------------ |---------------------------------------------- |--------------------------------------------------------- |
| PORT | 443 | Le port sur lequel l'application se lance |
| DB_URL | mongodb://127.0.0.1:27017/cryptool | L'URL vers la base de données MongoDB |
| URL | cryptool.atgrosdino.ca | L'URL vers le site en https et en prod |
| SSL_CERT | locahost.pem | Le nom du fichier `cert` pour le HTTPS |
| SSL_KEY | locahostKey.pem | Le nom du fichier `key` pour le HTTPS |
| SSL_CA | locahostCA.ca-bundle | Le nom du fichier `ca` pour le HTTPS |
| NODE_ENV | production | Si le site est en prod, en dev ou en test |
| ES256_KEY | localhost | Une clé ES256 pour signer les tokens |
| YAHOO_API | https://query1.finance.yahoo.com/v7/finance/ | L'URL de l'API Yahoo |
| YAHOO_API_DASH | https://query2.finance.yahoo.com/v7/finance/ | Second URL de l'API Yahoo |
| NEXT_PUBLIC_GOOGLE_ANALYTICS_TOKEN | G-TOKEN | Le jeton de Google Analytics |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID | - | L'ID Client pour Google SignIn |
| SENDGRID_API_KEY | - | La clé d'API pour utiliser SendGrid |
| SENDGRID_EMAIL_SENDER | - | L'email qui envoie les courriels SendGrid |

Pour la production, il est nécessaire de se créer un fichier `.prod.env`, fichier qui n'est pas suivi par Git, ainsi qu'un fichier `.prod.test.env`. Il faudra aussi ajouter `NODE_ENV=production` en `prod` et `NODE_ENV=test` en `test`.

## Scripts

| Script     | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| start      | Pour lancer l'application en prod avec le fichier `.prod.env`              |
| start-test | Pour lancer l'application de tests avec le fichier `.prod.test.env`        |
| dev        | Pour lancer l'application en dev avec le fichier `.local.env`              |
| format     | Lance `prettier` pour formatter le code                                    |
| build      | Pour « build » l'application next                                          |
| analyze    | Pour « build » l'application next en analysant les dependencies            |
| postbuild  | Pour générer les fichiers `sitemaps.xml` et `robots.txt`                   |
| lint       | Pour « lint » le code                                                      |
| lint:fix   | Pour « lint » et régler les problèmes rencontrés dans le code              |
| test       | Pour lancer les tests avec le fichier `.test.env`                          |
| test-ci    | Pour lancer les tests dans le runner GitLab avec le fichier `.test.ci.env` |
| test-dev   | Pour lancer les tests avec l'option `--watch`                              |

## Hébergement

L'application est hébergée sur Google Cloud avec Compute Engine. Nous avons pris une machine `e2-small` pour avoir 10go d'espace disque et 2go de RAM avec Ubuntu 20.04LTS. Nous avons ensuite réservé une adresse IP statique et avons ouvert les ports 443 et 4000. Sur l'instance, nous avons installé Docker et avons connecté le compte gitlab jdDeploy (compte qui a un accès Reporter) pour pouvoir aller fetch le code sur le repo distant.

La base de données est hébergée sur [MongoDB Cloud](https://www.mongodb.com/fr-fr/cloud). Nous avons créé un cluster en suivant les étapes pour créer un serveur gratuit (shared). Après, nous avons créé un utilisateur pour la connection et avons ajouté l'URL de la base de données dans le fichier `.prod.env`.

Étapes à reproduire une fois connecté à la machine:

-   Installation de [Docker](https://docs.docker.com/engine/install/ubuntu/)
-   Ajout des credentials Git avec:
    -   git config --global user.name "Your Name"
    -   git config --global user.email "youremail@yourdomain.com"
-   Download du code source en SSH (il faudra ajouter sa clé SSH au compte qui va « fetch »: [Gitlab SSH](https://docs.gitlab.com/ee/ssh/))
-   Démarrage de l'application avec `/riztkick/run.sh`

## Intégration

Le serveur d'intégration est GitLab CI avec le runner du Cégep ainsi qu'un runner personnel installé sur la même instance de Compute Engine que l'application. Quand du code est poussé sur `main`, le serveur va lancer les tests avec le script `test-ci` et va ensuite lancer le déploiement en envoyant les variables nécessaires. Une fois connecté, il va « fetch » le code sur le repo distant et relancer les containers Docker avec le script `/riztkick/run.sh`.

| Variable                   | Description                                   |
| -------------------------- | --------------------------------------------- |
| GCLOUD_IP                  | L'adresse IP de l'instance Compute Engine     |
| GCLOUD_USER                | Le nom d'utilisateur sur l'instance           |
| SSH_PRIVATE_KEY_GCLOUD     | La clé SSH pour se connecter à l'instance     |
| SSH_PRIVATE_KEY_GCLOUD_GIT | La clé SSH pour « fetch » le code sur le repo |

## Travail en local

Il faut avoir la version [Node 16+](https://nodejs.org/en/download/) pour pouvoir utiliser NextJS. L'installation sur Linux peut se faire en suivant ce [lien](https://techviewleo.com/install-node-js-and-npm-on-ubuntu/). Si Node est déjà installé, mais en version inférieure, suivre ce [lien](https://stackoverflow.com/a/10076029). Ensuite, il faudra rouler `npm install` dans le dossier `ritzkick` (la racine de l'application). Pour lancer en développement, il faut utiliser `npm run dev`. Pour lancer les tests, il faut utiliser `npm run test`.

### Windows

Pour la base de données, il faudra installer [MongoDB Community](https://www.mongodb.com/try/download/community) et [Robo3T](https://robomongo.org/). MongoDB Community devra être télécharger en ZIP et extrait sur le bureau. Dans le dossier extrait, il faut créer un dossier appelé `data`. Ensuite il faudra lancer ce script à la racine du dossier pour partir la base de données:

```bat
start bin\mongod.exe --dbpath="./data"
```

Dans Robo3T, lors de l'exécution, le programme demande la connection à utiliser. Il faudra s'en créer une avec le nom qu'on veut pour pouvoir voir la base de données dans un GUI.

### Linux

La base de données MongoDB Community peut être téléchargée en package `.deb`. Ensuite, il ne reste plus qu'à lancer le package pour l'installer et un daemon sera créé pour gérer la base de données.

## Liens

-   [Repository](https://gitlab.com/j-dumas/p-synthese-csfoy-ritzkick)
-   [Backlog](https://trello.com/b/KGp5conn)
-   [Site](https://cryptool.atgrosdino.ca)
-   [Site (testing)](http://test.cryptool.atgrosdino.ca)
