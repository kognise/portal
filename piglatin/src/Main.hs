{-# LANGUAGE OverloadedStrings #-}
module Main where

import qualified Data.ByteString as BS

import           Control.Applicative
import           Snap.Core
import           Snap.Util.FileServe
import           Snap.Http.Server

main :: IO ()
main = quickHttpServe site

site :: Snap ()
site =
    ifTop (serveDirectory "./static") <|>
    route [
          ("piglatin/:str", piglatin)
          ]

piglatin :: Snap ()
piglatin = writeBS $ unwords . fmap BS.unpack . getParam "str" . words where wordToPl = (\(x, y) -> y ++ x ++ "ay") . break (`elem` "aeiouAEIOU")
