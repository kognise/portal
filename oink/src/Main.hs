{-# LANGUAGE OverloadedStrings #-}
module Main where
import qualified Data.Text as T
import           Data.Text.Encoding
import           Data.Maybe

import           Control.Applicative
import           Snap.Core
import           Snap.Util.FileServe
import           Snap.Http.Server

replace :: Eq a => a -> a -> [a] -> [a]
replace a b = map $ \c -> if c == a then b else c

main :: IO ()
main = httpServe (setPort 80 mempty) site <|> quickHttpServe site

site :: Snap ()
site = route [
        ("oink", piglatin)
    ] <|>
    ifTop (serveDirectory "./static")

piglatin :: Snap ()
piglatin = do
    param <- getParam "str"
    writeText $ T.pack . unwords . fmap wordToPl . words . replace '+' ' ' . T.unpack . decodeUtf8 . fromJust $  param where wordToPl = (\(x, y) -> y ++ x ++ "ay") . break (`elem` ("aeiouAEIOU" :: String))
