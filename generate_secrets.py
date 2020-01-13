#!/usr/bin/env python3

import hashlib
import random
import subprocess
import os

class Config:
    nodeEnv = "development"
    backendPort = "8080"
    # name of the container
    databaseHost = "db"

def generateRandomHash():
    leftBound, rightBound = (0, 999)
    rawString = ''
    for epoch in range(random.randint(leftBound, rightBound)):
        rawString += str(random.randint(leftBound, rightBound))

    return hashlib.sha512(rawString.encode()).hexdigest()

def generateKeyPairString(key, joiner, value):
    return f"{key}{joiner}{value}"

def runShellCommand(cmd: str):
    return subprocess.run([cmd], shell=True, stdout=subprocess.PIPE).stdout.decode().rstrip()

secrets = {
    'MYSQL_ROOT_PASSWORD': generateRandomHash(),
    'MYSQL_DATABASE': generateRandomHash(),
    'MYSQL_USER': generateRandomHash(),
    'MYSQL_PASSWORD': generateRandomHash(),
    'SERVER_PORT': Config.backendPort,
    'DATABASE_HOST': Config.databaseHost,
    'NODE_ENV': Config.nodeEnv,
}

'''
with open('secrets', 'w') as secretsFile:
    fields = [
        'MYSQL_ROOT_PASSWORD',
        'MYSQL_DATABASE',
        'MYSQL_USER',
        'MYSQL_PASSWORD',
    ]
    for field in fields:
        secretsFile.write(generateKeyPairString(field, ': ', secrets[field]))
        secretsFile.write('\n')
'''

with open('backend/.env', 'w') as backendEnvFile:
    fields = [
        'NODE_ENV',
        'SERVER_PORT',
        'MYSQL_DATABASE',
        'DATABASE_HOST',
        'MYSQL_USER',
        'MYSQL_PASSWORD',
    ]
    for field in fields:
        backendEnvFile.write(generateKeyPairString(field, '=', secrets[field]))
        backendEnvFile.write('\n')

secretsDir = "secrets"
if not os.path.isdir(f'./{secretsDir}'):
    os.mkdir(f'./{secretsDir}')

print("Writing these secrets to the filesystem...", end="")
for secretName, secretValue in secrets.items():
    with open(f"./{secretsDir}/{secretName}", "w") as secretsFile:
        secretsFile.write(secretValue);
print("Done.")
