> 🚩 **This project is archived!** 🚩
> 
> *This one is pretty simple, I just don't have any interest in it anymore, it isn't deployed anymore, and it doesn't have any users.*

# Local Development Quickstart

Because I spent way too long figuring this out, it's super easy to develop Project Portal locally!

- [Install Vagrant](https://www.vagrantup.com/downloads.html) if you haven't already
- Run `vagrant up` to create and provision a VM
- Run `vagrant ssh` to connect to it
- In the VM:
  - Run `start` and wait for it to finish
  - Run `exit`
- A local deployment should be accessible at [localhost:8080](http://localhost:8080)

You can also run `curl -s https://raw.githubusercontent.com/kognise/portal/master/provision.sh | bash` on GCP.
