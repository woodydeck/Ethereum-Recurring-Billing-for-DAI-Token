**How to Use**

This is a working project, but not documented. If you are looking to do recurring billing for Ethereum, there are a lot of workarounds and compromises you must consider. This probably will help you along the way. It is a barebones contract with no unneeded bullshit.

To deploy this you just need the frontend.html with the assets folder. This was done down and dirty in Bootstrap Studio, and I wasn't worried about the design. The server.js (it's node.js) doesn't interact at all with the frontend. It is just reading the state of the blockchain with Web3.js and doing things like billing accounts.

**Why did I shelve this project?**

There aren't enough Ethereum users to worry about this scheme yet, but for the users there are, it's a mighty large leap to be able to read this contract well enough to understand that it cannot bill for more than it authorizes. Unfortunately, most token contracts do not have ApproveAndCall functions, you can only approve an amount. DAI is no different. This means that the end user has to authorize your contract for an unlimited amount. Scary!

This all works out because the contract cannot be changed in a way to allow someone to be billed early or more than they authorize in the contract, but the end user must understand that this is true by reading the code. Sigh. Really, this is what happens when millennials design things. They expect that everyone is as 'intelligent' as they are. Assholes. :staresattrufflecontributorslist:

I searched through a lot of token contracts to base this on. I discovered the dangers of KYC shitcoins like Tether...Like how they can blacklist tokens on a whim. I also found out how shitheads copypasta-ing Consensys shitcode with polymorphism can open other vulnerabilities.

Kids, if you are using polymorphism in smart contracts, you are doing it wrong, and you should learn to code better. It makes things unreadable for the average programmer, let alone the mouth drooling socialist brat of a get-rich-quick layman. Keep your contracts concise, and err towards brute force. You will never go wrong with this strategy.

If you have any questions, just open an issue. I will try to reply when I have time, even if you are commie swine. We are all equal in this space.
