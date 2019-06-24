# Azure

## Key Vault

* application registers with Azure Active Directory and receives client id and secret
* Tools
  * azure services authentication extension for VS 2017 update 5
    * allows local projects to use Azure MSI to authenticate
    * tools -> options -> azure service authentication
  * MS credential scanner
    * monitors github commits and checks for accidentally added secrets
* Nuget Packages
  * Microsoft.IdentityModel.Clients.ActiveDirectory
  * Microsoft.Azure.KeyVault
  * Microsoft.Azure.Services.AppAuthentication
* problem
  * if you move a secret to key vault, you still need to authenticate to key vault
  * need a way to authenticate to key vault in a "trusted" environment
  * likely need to use MSI to authenticate ot key vault, and then access secrets

## Managed Service Identity (MSI)

* Allows for connection to services without credentials or key vault
* only works for other Azure services that consume Azure Active Directory
