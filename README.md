# Cryptool

## Fichiers de configurations

Les fichiers de configuration sont disponibles dans le dossier `env`.
Les variables nécessaires (exemples de valeurs):
| Variable                           	| Valeur                                       	| Description                                             	|
|------------------------------------	|----------------------------------------------	|---------------------------------------------------------	|
| PORT                               	| 443                                          	| Le port sur lequel l'application se lance               	|
| DB_URL                             	| mongodb://127.0.0.1:27017/cryptool           	| L'URL vers la base de données MongoDB                    	|
| SSL                                	| true                                         	| Si le site utilise HTTPS ou non                         	|
| JWTSECRET                          	| SECRET123                                    	| Le secret pour signer les JWTs                          	|
| YAHOO_API                          	| https://query1.finance.yahoo.com/v7/finance/ 	| L'URL de l'API Yahoo                                    	|
| NEXT_PUBLIC_PROD                   	| true                                         	| Si l'application se lance en PROD pour Google Analytics 	|
| NEXT_PUBLIC_GOOGLE_ANALYTICS_TOKEN 	| G-TOKEN                                      	| Le jeton de Google Analytics                            	|

Pour la production, il est nécessaire de se créer un fichier `.prod.env`, fichier qui n'est pas suivi par git.

## Scripts

| Script     	| Description                                                                	|
|------------	|----------------------------------------------------------------------------	|
| start      	| Pour lancer l'application en PROD avec le fichier `.prod.env`              	|
| start-test 	| Pour lancer l'application de tests avec le fichier `.prod.test.env`        	|
| dev        	| Pour lancer l'application en DEV avec le fichier `.local.env`              	|
| build      	| Pour « build » l'application next                                          	|
| postbuild  	| Pour générer les fichiers `sitemaps.xml` et `robots.txt`                   	|
| lint       	| Pour « lint » le code                                                      	|
| test       	| Pour lancer les tests avec le fichier `.test.env`                          	|
| test-ci    	| Pour lancer les tests dans le runner GitLab avec le fichier `.test.ci.env` 	|
| test-dev   	| Pour lancer les tests avec l'option `--watch`                              	|

## Hébergement

L'application est hébergée sur Google Cloud avec Compute Engine. Nous avons pris une machine `e2-small` pour avoir 10go d'espace disque et 2go de RAM. Nous avons ensuite réservé une adresse IP statique et avons ouvert les ports 3000 et 443. Sur l'instance, nous avons ensuite installé Docker et avons connecté le compte gitlab jdDeploy (compte qui a un accès Reporter) pour pouvoir aller fetch le code sur le repo distant.

La base de données est hébergée sur [MongoDB Cloud](https://www.mongodb.com/fr-fr/cloud). Nous avons créé un cluster en suivant les étapes pour créer un serveur gratuit (shared). Après, nous avons créer un utilisateur pour la connection et avons ajouter l'URL de la base de données dans le fichier `.prod.env`.

## Intégration

Le serveur d'intégration est GitLab CI avec le runner du cégep ainsi qu'un runner personnel installé sur la même instance de Compute Engine que l'application. Quand du code est poussé sur `main`, le serveur va lancer les tests avec le script `test-ci` et va ensuite lancer le déploiements en envoyant les variables nécessaire. Une fois connecté, il va « fetch » le code sur le repo et relancer les containers Docker avec le script `/riztkick/run.sh`.

| Variable                   	| Description                                   	|
|----------------------------	|-----------------------------------------------	|
| GCLOUD_IP                  	| L'adresse IP de l'instance Compute Engine     	|
| GCLOUD_USER                	| Le nom d'utilisateur sur l'instance           	|
| SSH_PRIVATE_KEY_GCLOUD     	| La clé SSH pour se connecter à l'instance     	|
| SSH_PRIVATE_KEY_GCLOUD_GIT 	| La clé SSH pour « fetch » le code sur le repo 	|

## Travail en local

Il faut avoir la version Node 16+ pour pouvoir utiliser NextJS. Ensuite, il faudra rouler `npm install` dans le dossier `ritzkick` (la racine de l'application).

### Windows
Pour la base de données, il faudra installer [MongoDB Community](https://www.mongodb.com/try/download/community) et [Robo3T](https://robomongo.org/). MongoDB Community devra être télécharger en ZIP et extrait sur le bureau. Dans le dossier extrait, il faut créer un dossier appelé `data`. Ensuite il faudra lancer ce script à la racine du dossier pour partir la base de données:

```bat
start bin\mongod.exe --dbpath="./data"
```

Dans Robo3T, lors de l'exécution, le programme demande la connection à utiliser. Il faudra s'en créer une avec le nom qu'on veut pour pouvoir voir la base de données dans un GUI.

### Linux
La base de données MongoDB Community peut être télécharger en package `.deb`. Ensuite, il ne reste plus qu'a lancer le package pour l'installer et un daemon sera créé pour gérer la base de donnée.

## Liens

- [Repository](https://gitlab.com/j-dumas/p-synthese-csfoy-ritzkick)
- [Backlog](https://trello.com/b/KGp5conn)
- [Site](https://cryptool.atgrosdino.ca)
