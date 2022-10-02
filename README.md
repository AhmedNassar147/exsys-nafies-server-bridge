1- node - git - yarn - lerna

_NOTE_: to check if these tools are installed yarn run
1- yarn -v
2- node -v
3- git -v
4- lerna -v
if you didn't get any one of them version please install it

------------------------------------------------ install above tools --------------------
install NODE => https://nodejs.org/en/download/
install GIT: => https://gitforwindows.org/
install YARN => https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable (click `Alternatives` text then click `download installer`)
install Lerna => yarn global add lerna

-------------------------------- install project code -----------------------------------
_if installations are done_
install the project via
1- open a cmd
2- git clone https://github.com/AhmedNassar147/exsys-nafies-server-bridge.git
3- cd exsys-nafies-server-bridge

4- yarn bootstrap

---------------------------------------------- now you got all installation done --------
to run the project
1- crate a batch file (with whatever name you want) like myfile.bat
2- in that file set this content into => start-exsys-nphies-bridge --ignore-cert

------------------------------------------- our cli options ----------------------------
in cmd run this command to see all options
start-exsys-nphies-bridge --h
