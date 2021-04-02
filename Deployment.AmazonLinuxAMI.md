# Amazon Linux 2 AMI Production/Staging Deployment

This guide is for the `Sprobe Base Template` deployment in fresh `production/staging` Amazon Linux 2 AMI servers.

Pre-requisites:  
- Server Credentials
- Repository Access (Server IP Whitelisted by Sir Robert to Clone Repo from Phabricator)
- Docker
- Docker Compose
- Git
- Port 80, 443, 3306 Open by Server Firewall or Security Group in AWS

**IMPORTANT**  
If it is the first deployment of the project to the server, follow the guide in
- [First Deployment / Fresh Install](#first-deployment)
  
If the project is already setup in the server, just follow the guide in
- [Succeeding Deployment](#succeeding-deployment)

---

## <a id="first-deployment"></a> First Deployment / Fresh Install

Login to the Production/Staging Server via SSH
```
ssh -i file.pem username@IPADDRESS
// example
ssh -i project.pem ec2-user@1.1.1.1
```

### Docker
Install `docker` in the server
```
sudo yum update -y
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo chkconfig docker on
```
To check if docker is successfully installed and running, run the following command:
```
sudo systemctl status docker

// OUTPUT
docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since Mon 2020-12-07 01:54:08 UTC; 49s ago
     Docs: https://docs.docker.com
 Main PID: 3547 (dockerd)
   CGroup: /system.slice/docker.service
           └─3547 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock --default-ulimit nofile=1024:4096
```
**IMPORTANT**  
To run docker commands without using `sudo`, add the current logged in user to docker group using the following command.  

Just copy the command directly WITHOUT replacing the `${USER}` text:
```
sudo usermod -aG docker ${USER}
```
After running the commmand above, logout from the server then login again via ssh.

Once logged in again, verify if you can run docker without `sudo`
```
docker -v
// output
Docker version xx.xx.xx, build xxxxxxxx
```

### Docker Compose
Install `docker-compose` in the machine. Just copy the command directly WITHOUT replacing the `uname` text: 
```
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
```
Verify if the installation is successful
```
docker-compose --version

// OUTPUT
docker-compose version x.xx.x, build xxxxx
```

### Git
Install `git` in the server
```
sudo yum update -y
sudo yum install -y git
sudo yum -y groupinstall "Development Tools"
git --version

// Output
git version x.xx.x
```

### Clone and Build the Project
Generate new public key for the server by running the command (Press enter, Leave Passphrase empty)
```
ssh-keygen

// OUTPUT
Generating public/private rsa key pair.
Enter file in which to save the key (/home/ubuntu/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/ubuntu/.ssh/id_rsa.
Your public key has been saved in /home/ubuntu/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:Up6KjbnEV4Hgfo75YM393QdQsK3Z0aTNBz0DoirrW+c ylo@klar
The key's randomart image is:
+---[RSA 2048]----+
|    .      ..oo..|
|   . . .  . .o.X.|
|    . . o.  ..+ B|
|   .   o.o  .+ ..|
|    ..o.S   o..  |
|   . %o=      .  |
|    @.B...     . |
|   o.=. o. . .  .|
|    .oo  E. . .. |
+----[SHA256]-----+
```
Run the following command and add it as SSH key in `Phabricator / Github / Bitbucket`
```
cat ~/.ssh/id_rsa.pub

// OUTPUT
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDJlAKTIMZDK= user@machine
```

Clone the repository in the server.
```
cd ~
git clone ssh://your.vcs.com/your_project_repo.git
cd your_project_repo
```
Copy and Update the following `.env` files
- `your_project_repo/.env`
- `your_project_repo/src/backend/.env`
- `your_project_repo/src/frontend/.env`

**IMPORTANT CONFIGURATION**  
For `your_project_repo/.env` make sure to set this two values to `0` instead of 1 for faster and optimized php container performance
```
...
...
OPCACHE_VALIDATE_TIMESTAMPS=0
ENABLE_XDEBUG=0

```
For `repo_name/src/backend/.env` make sure to set the `APP_DEBUG` to false
```
APP_ENV=production
...
APP_DEBUG=false

```
Finally, Build all the `docker containers` by following the guide in `README.md` file. It is same process on how you build the containers for the first time in on your local environment/PC. The only difference are the values on the `.env` files.

---

## <a id="succeeding-deployment"></a> Succeeding Deployment
The complex part is only during the first deployment since you need to install the necessary libraries to build and run the application.

After the first deployment and build, the suceeding deployment will be just as simple as the following steps:  

Login to the Production/Staging Server via SSH
```
ssh -i file.pem username@IPADDRESS
// example
ssh -i project.pem ec2-user@1.1.1.1
```

1. Navigate to your project directory
```
cd ~/repo_name
```
2. Fetch the recent changes from your repository
```
git fetch origin
git merge origin/master
```
3. If there are changes in Fronted (React)

If there are new `npm packages` added to project run:
```
docker-compose run --rm node npm install
```
Run the build script for react
```
docker-compose run --rm node npm run build
```
4. If there are changes in the Backend (Laravel)

If there are new `composer packages` added to project run:
```
docker-compose run --rm composer install
```
Make sure to always restart the PHP container every deployment since files are Cached by `OpCache`
```
docker-compose restart php
```
