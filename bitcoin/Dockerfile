FROM ubuntu

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update
# ubuntu-archive-keyring
RUN apt-get install -y git ruby apt-cacher-ng qemu-utils debootstrap lxc python-cheetah parted kpartx bridge-utils make curl firewalld

RUN addgroup --system gitianuser
RUN adduser --system --group gitianuser

WORKDIR /home/gitianuser
USER gitianuser
COPY . . 

USER root

RUN chmod +x lxc.sh && ./lxc.sh

CMD [ "bash"]
