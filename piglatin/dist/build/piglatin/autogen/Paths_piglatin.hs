{-# LANGUAGE CPP #-}
{-# LANGUAGE NoRebindableSyntax #-}
{-# OPTIONS_GHC -fno-warn-missing-import-lists #-}
module Paths_piglatin (
    version,
    getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir,
    getDataFileName, getSysconfDir
  ) where

import qualified Control.Exception as Exception
import Data.Version (Version(..))
import System.Environment (getEnv)
import Prelude

#if defined(VERSION_base)

#if MIN_VERSION_base(4,0,0)
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#else
catchIO :: IO a -> (Exception.Exception -> IO a) -> IO a
#endif

#else
catchIO :: IO a -> (Exception.IOException -> IO a) -> IO a
#endif
catchIO = Exception.catch

version :: Version
version = Version [0,1] []
bindir, libdir, dynlibdir, datadir, libexecdir, sysconfdir :: FilePath

bindir     = "/home/jackfly26/.cabal/bin"
libdir     = "/home/jackfly26/.cabal/lib/x86_64-linux-ghc-8.6.3/piglatin-0.1-JnZXamGoql547pGXRKcMFN-piglatin"
dynlibdir  = "/home/jackfly26/.cabal/lib/x86_64-linux-ghc-8.6.3"
datadir    = "/home/jackfly26/.cabal/share/x86_64-linux-ghc-8.6.3/piglatin-0.1"
libexecdir = "/home/jackfly26/.cabal/libexec/x86_64-linux-ghc-8.6.3/piglatin-0.1"
sysconfdir = "/home/jackfly26/.cabal/etc"

getBinDir, getLibDir, getDynLibDir, getDataDir, getLibexecDir, getSysconfDir :: IO FilePath
getBinDir = catchIO (getEnv "piglatin_bindir") (\_ -> return bindir)
getLibDir = catchIO (getEnv "piglatin_libdir") (\_ -> return libdir)
getDynLibDir = catchIO (getEnv "piglatin_dynlibdir") (\_ -> return dynlibdir)
getDataDir = catchIO (getEnv "piglatin_datadir") (\_ -> return datadir)
getLibexecDir = catchIO (getEnv "piglatin_libexecdir") (\_ -> return libexecdir)
getSysconfDir = catchIO (getEnv "piglatin_sysconfdir") (\_ -> return sysconfdir)

getDataFileName :: FilePath -> IO FilePath
getDataFileName name = do
  dir <- getDataDir
  return (dir ++ "/" ++ name)
