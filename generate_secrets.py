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
    host = "0.0.0.0"

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

mysql_username = generateRandomHash()
mysql_username_middle_index = int(len(mysql_username) // 4)
mysql_username = mysql_username[:mysql_username_middle_index]
# mysql_username = "random_user_name@%"

secrets = {
    'SERVER_PORT': Config.backendPort,
    'NODE_ENV': Config.nodeEnv,
    # 'MYSQL_HOST': Config.host,
}

'''
with open('secrets', 'w') as secretsFile:
    fields = [
    ]
    for field in fields:
        secretsFile.write(generateKeyPairString(field, ': ', secrets[field]))
        secretsFile.write('\n')
'''

env_paths = [
    './backend/.env',
    './frontend/.env',
    './.env',
    './frontend/src/config/.env',
]

for path in env_paths:
    with open(path, 'w') as backendEnvFile:
        fields = [
            'NODE_ENV',
            'SERVER_PORT',
        ]
        for field in fields:
            backendEnvFile.write(generateKeyPairString(field, '=', secrets[field]))
            backendEnvFile.write('\n')

'''
secretsDir = "secrets"
if not os.path.isdir(f'./{secretsDir}'):
    os.mkdir(f'./{secretsDir}')

print("Writing these secrets to the filesystem...", end="")
for secretName, secretValue in secrets.items():
    with open(f"./{secretsDir}/{secretName}", "w") as secretsFile:
        secretsFile.write(secretValue);
print("Done.")
'''
