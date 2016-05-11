# Libraries
```bash
sudo pip install django
```

#Ansible
```bash
# To deploy and update webapp
sudo ansible-playbook playbooks/deploy-webapp.yaml
```

## Build
```bash
# Make sure you are under the root directory of where the gulpfile is
# Install node modules that's specified in the package.json
npm install
# Step 1 - build and packge the application to dist folder
gulp
# Step 2 - build docker image and push to docker hub
gulp docker-publish
```