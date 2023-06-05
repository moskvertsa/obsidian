# Obsidian

## Demo

* [Pitch + Demo](https://drive.google.com/file/d/1goJtAO6I8vEjHgc1TDV9EVnMJN7bFAgJ/view?usp=sharing)


## Introduction

Obsidian is a protocol that enables privacy-preserving stealth payments on OKTC. It was conceived in response to a [tweet](https://twitter.com/VitalikButerin/status/1245149156043350016) by Vitalik Buterin back in March 2020. 
 
With a stealth address, a payer can send OKT or KIP20 tokens to an address controlled by the receiver, but no one except the two parties know who the receiver is. Obsidian leverages the properties of elliptic-curve cryptography to enable payments where only the sender and the receiver know the receiver’s identity.

One way to think of Obsidian is this: before anyone sent you funds, you sent them a brand new, never before used address. Only the sender would know you control that address, which adds a layer of privacy to your payment. Payments via Obsidian work similarly, but are non-interactive—you don’t need to give someone a fresh address, the sender can just generate one they know only you will be able to access.


## How it works

Suppose Alice wants to sent 10 OKT to Bob. If she proceeded with a regular transfer, anyone can trivially inspect the blockchain transaction and know Alice sent 10 OKT to Bob. But, Alice and Bob care about privacy, so they use the Obsidian protocol.

Bob first sets up his account by signing a message, the hash of which is used to generate two private keys: these keys allow him to securely use Obsidian without compromising the private keys of his connected wallet. He then submits a transaction to save the corresponding public keys on-chain, so anyone can use them to send him stealth payments. Alice uses Bob's public key and sends the funds via Obsidian. Behind the scenes, a stealth address is generated from Bob's public key and a randomly generated number. The funds are sent to this address (and not to Bob's public key). 

On-chain, Alice appears to send 10 OKT to an otherwise empty address. Bob can then withdraw the funds by generating the private key corresponding to the stealth address. This private key is generated from Bob's private key and the random number used to generate the stealth address -- he can either send these funds to an exchange, or to another unaffiliated address.


## How it *actually* works

Bob has a public key `P` and private key `p`. Alice generates a random number `r`, and computes a stealth address as `P_stealth = P * r` using elliptic curve multiplication. Alice derives the Ethereum address `a_stealth` from that public key, and sends funds to it. Thanks to the magic of elliptic curve math, Bob can generate the private key `p_stealth` needed to access funds at `a_stealth` by computing `p_stealth = p * r`, and withdraw funds from this address.


## Looking forward...

* Private payments with any regular KIP20 token (currently only OKT is supported)
* Meta-transactions for gasless payments
* Name Service integration
* Deployment on OKTC Mainnet as well (currently only on OKTC Testnet)