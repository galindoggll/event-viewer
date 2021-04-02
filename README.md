# Laravel ReactJS Boilerplate
A base template for `ReactJS (16.9.0)` with backend API implementation using `Laravel (6.18.35)` preconfigured `laravel/passport` authentication.  

## Specifications / Infrastructure Information  
* Nginx
* PHP-FPM
* MySQL
* CS-Fixer
* Data Volume
* Composer
* Cron
* Node/NPM
* Redis

## Prerequisites
- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

# Getting Started
Setup the `.env` file for Docker in the root directory  
```
cp .env.example .env
```
Make sure to fillup the following variables
```
ENVIRONMENT=development                   # development/staging/production
PROJECT_NAME=YOUR_PROJECT_NAME_HERE       # Prefix for the Docker Containers to be created
MYSQL_ROOT_PASSWORD=ANY_STRONG_PASSWORD   # root password of the root mysql user
MYSQL_DATABASE=YOUR_DATABASE_NAME         # use this value in src/backend/.env
MYSQL_USER=YOUR_DATABASE_USER             # use this value in src/backend/.env
MYSQL_PASSWORD=ANY_STRONG_PASSWORD        # use this value in src/backend/.env
....
....
....
API_DOMAIN=api.tcg.local                # for local development. change accordingly per environment
APP_DOMAIN=tcg.local                    # for local development. change accordingly per environment
```
For Local Development in windows, add the following lines to `C:\Windows\System32\drivers\etc\hosts` or `/etc/hosts` for ubuntu  
```
127.0.0.1    tcg.local api.tcg.local
```
Note: Replace `127.0.0.1` with your Docker Machine IP.  
  
## Build the all containers  
```
docker-compose build
```
To build/rebuild a specific container, run the following command, CONTAINER_NAME is from the `docker-compose.yml`  
```
docker-compose build CONTAINER_NAME
```
Start the containers  
```
docker-compose up -d

# Output
Starting {PROJECT_NAME}_redis    ... done
Starting {PROJECT_NAME}_mysql    ... done
Starting {PROJECT_NAME}_data     ... done
Starting {PROJECT_NAME}_node     ... done
Starting {PROJECT_NAME}_fixer    ... done
Starting {PROJECT_NAME}_composer ... done
Starting {PROJECT_NAME}_cron     ... done
Starting {PROJECT_NAME}_php      ... done
Starting {PROJECT_NAME}_nginx    ... done
```
Run the following command to login to any Docker Container  
```
docker exec -it CONTAINER_NAME bash
```

---

## Composer
Install the composer packages of your project
```
docker-compose run --rm composer install
```
To install new / additional composer packages, run the following command:
```
docker-compose run --rm composer install owner/package
```
To remove a package:
```
docker-compose run --rm composer remove owner/package
```

---
## Setting up Laravel
1. Create the `.env` file and run the following to generate key for Laravel  
2. Update the database credentials values in `src/backend/.env` using your code text editor then clear the config via docker exec 
3. Run the migration
4. If you have seeders, you can run it by using the following command
5. Run the Laravel Passport installation
```
docker exec -it {PROJECT_NAME}_php sh
/var/www/backend # cp .env.example .env                             # 1
/var/www/backend # php artisan key:generate                         # 1
/var/www/backend # php artisan config:clear                         # 2
/var/www/backend # php artisan migrate:fresh                        # 3
/var/www/backend # php artisan db:seed                              # 4
/var/www/backend # php artisan passport:install --force             # 5
```
Copy the generated password grant Client ID & Secret in the `src/backend/.env` file
```
API_CLIENT_ID={COPY FROM TERMINAL}
API_CLIENT_SECRET={COPY FROM TERMINAL}
API_VERSION=v1
```
After setting up all the values in the `.env` file, run the following command to make sure the environment variables are updated successfully.  
```
docker exec -it {PROJECT_NAME}_php sh
/var/www/backend # php artisan config:clear
```

---

## PSR2 Coding Style
Running the Coding Standards Fixer Container  
  
To check without applying any fixes, run the following command:
```
docker-compose run --rm fixer fix --dry-run -v
```
To fix all your PHP code to adhere the PSR2 Coding style, run:
```
docker-compose run --rm fixer fix
```
To Apply fix only to a specific file
```
docker-compose run --rm fixer fix <<file_name>>
```

## Unit Testing  
### PHPUnit  
- Running a Test Case
```
docker-compose run --rm php ./phpunit tests/<<test_file>>
```
- Running the whole Test Suite
```
docker-compose run --rm php ./phpunit
```
The code coverage result will be available at  
<https://API_DOMAIN/report>
  
The code coverage logs will be available at  
<https://API_DOMAIN/report/logs>

---

## PHP Debugging
**IMPORTANT:** Make sure to disable xDebug in Staging/Production environment for faster php container.

To enable PHP xDebug in your development environment, update the ***.env*** value into:  
```
...
...
ENABLE_XDEBUG=1
```
Accepted Values:
  - ENABLE_XDEBUG=0 - Disable
  - ENABLE_XDEBUG=1 - Enable

Install the VS Code extension **PHP Debug** by **Felix Becker** then restart your VS Code.  

Open the PHP file you want to debug. Add your breakpoints by clicking the left side of the Line Number of the file you want to debug.  

**Breakpoints** are those red dot beside the Line Number. Once you have your breakpoints, press **F5**. Trigger the function by accessing the route via postman/browser.  

---

## PHP OpCache
OPcache improves PHP performance by storing precompiled script bytecode in shared memory, thereby removing the need for PHP to load and parse scripts on each request.  

By default, OPcache is already enabled when the php container is built. Somehow you need to do another step in order get the best performance especially in production site.

During development, update the **.env** file value to
```
OPCACHE_VALIDATE_TIMESTAMPS=1
```
If this is set to 1, you can see the changes directly since PHP will check if you have any changes to your .php files.  

To achieve a 4-5x performance/speed boost in your staging/production site, update the `.env ` file into:
```
OPCACHE_VALIDATE_TIMESTAMPS=0
```
However if you it set this to 0, the system ignores and doesn't check any changes in you PHP files. So if you edited/uploaded any .php files, you will not see it reflected on your site.

Make sure to restart/reload the PHP container after deploying any code changes in staging/production site if you set the value to:
```
OPCACHE_VALIDATE_TIMESTAMPS=0
```

---

## BACKEND
To access the backend routes, use the **API_DOMAIN** you set in the `.env` file
```
API_DOMAIN=api.tcg.local                  # for local development
```
in this case: https://api.tcg.local/v1  

We are using **`v1`** as base suffix for our api routes following the rest standards. All routes should be declared in the **`src/backend/routes/api.php`** file.

---

## FRONTEND
This package uses ReactJS as frontend framework. This docker setup will automatically serve the ReactJS via node container.  

All the source code for frontend development is in `src/frontend` directory. Any file changes in the `src/frontend` will reflect  
automatically via Hot Reload Module.

Create the `src/frontend/.env` file with the following variable and corresponding values
```
REACT_APP_API_URL=                   // THE API DOMAIN SET ON DOCKER ENV FILE
REACT_APP_CLIENT_ID=                 // GENERATED FROM php artisan passport:install
REACT_APP_CLIENT_SECRET=             // GENERATED FROM php artisan passport:install
```
Restart the docker-containers
```
docker-compose restart
```

## NPM Packages
In case you want to install additional NPM packages, you must login to the Node Container
```
docker exec -it --user=root {PROJECT_NAME}_node sh

# In case the command above fails, run this instead
winpty docker exec -it {PROJECT_NAME}_node sh
``` 
Then run the install command inside the Node Container
```
docker exec -it --user=root {PROJECT_NAME}_node sh
/var/www/frontend # npm install some-package-name (e.g eslint webpack)
```

---

### Usage
If you have already run the laravel seeders during the setup, you can test the frontend login using the following account:
```
email: admin@tcg.sprobe.ph
password: Password2020!
```
