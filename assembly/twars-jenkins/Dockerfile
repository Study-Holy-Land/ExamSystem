FROM jenkins:1.625.3
# if we want to install via apt
USER root
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - \
    && apt-get install -y nodejs \
    && npm install jasmine -g

USER jenkins
