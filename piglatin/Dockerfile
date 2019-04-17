FROM haskell
WORKDIR /usr/src/app

ADD . .
RUN cabal update
RUN cabal install
EXPOSE 80
CMD [ "cabal", "run" ]