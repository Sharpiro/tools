FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y git sudo python3 lsb-release
RUN apt-get install -y git vim
# RUN apt-get install -y systemd
# COPY . . 
# RUN cp lxc-net /etc/default/lxc-net
# RUN apt-get install -y lxc
# RUN systemctl enable lxc

# setup user
RUN addgroup --system gitianuser
RUN adduser --system --group gitianuser
RUN adduser gitianuser sudo
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
# workaround for bug https://unix.stackexchange.com/a/578950/297767
RUN echo "Set disable_coredump false" >> /etc/sudo.conf

USER gitianuser

WORKDIR /home/gitianuser
RUN git clone https://github.com/bitcoin/bitcoin
RUN cp bitcoin/contrib/gitian-build.py .
COPY . . 
RUN chmod +x docker_install.sh

# # RUN ./gitian-build.py --setup

# # ENTRYPOINT ["/home/gitianuser/docker_install.sh"]

CMD ["bash"]
# CMD ["/sbin/init" ]
