# Mobile NFT MARKETPLACE App (React Native)

This repository contains code for Mobile NFT MARKETPLACE project.The application is an online web3 marketplace for NFTs and crypto collectibles. Browse, create, buy, sell, and auction NFTs, including art, music, photography, trading cards and virtual worlds.

The core cryptocurrencies used are Ethereum and other cryptos, you can’t use fiat currencies like U.S. dollars or euros.

You must also pay the gas fee for completing NFT transactions with Ethereum. Gas fees are the transaction fees paid to miners.

- State: production

## Prerequisites

- [NodeJS](https://nodejs.org) 16.14.0
- [Watchman](https://facebook.github.io/watchman/)
- [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) 13
- [Cocoapods](https://cocoapods.org) 1.11.3
- [JDK](https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html) 11.0.13
- [Android Studio and Android SDK](https://developer.android.com/studio) 
- [Yarn](https://classic.yarnpkg.com/en/) 1.22.17
- Gitlab ci/cd

## Base dependencies

- [react]() 17.0.2
- [react-native]() 0.67.3 
- [@metamask/sdk]() 0.1.0 connect their dapps with a MetaMask wallet by automatic deeplink.


## Set up and Run demo

### Clone

Clone the repository from GitLab.

```
$ git clone https://gitlab.com/Rabeh_duetodata/nft.git
```
### Install Dependencies

```
$ yarn 
$ cd ios && pod install  
```
### Clean the app

```
$ yarn clean-cache:ios
$ yarn clean-cache:windows
$ yarn clean:android
$ yarn clean:ios

```
### Run the Android app

```
$ yarn android
```

### Run the IOS app

```
$ yarn ios
```


