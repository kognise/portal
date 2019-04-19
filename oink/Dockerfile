FROM haskell:latest
WORKDIR /usr/src/app

COPY  . .
RUN cabal update
RUN cabal install
EXPOSE 80
CMD [ "cabal", "run" ]