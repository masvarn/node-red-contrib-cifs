# Description

Node-Red Node to download files from a SMB/CIFS Server via `NT LM 0.12`.
Authentification can only be done via NTLM response.
It's main use is to connect to a Siemens PCU. That's why the username is currently predefined as AUDUSER.


## Installation

    npm install node-red-contrib-cifs -g

## Usage

```js
msg.remote = "remote/path/to/file.txt";
msg.host = "192.168.XX.XXX";
msg.user = "user";
msg.password = "password";
```

The output will be a `msg.payload` containing a Buffer of your file.
If no file is found the node will output an empty string and throw an error.

## TODO

- add user
- add share
- better html