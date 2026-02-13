targetScope = 'resourceGroup'

@description('Environment name (dev or prod)')
param environment string

@description('Location for all resources')
param location string = resourceGroup().location

@description('Repository URL for Static Web App')
param repositoryUrl string = 'https://github.com/RangerDjanger/Habit-tracker'

@description('Branch for Static Web App')
param branch string = 'main'

module staticWebApp 'modules/static-web-app.bicep' = {
  name: 'swa-${environment}'
  params: {
    environment: environment
    location: location
    repositoryUrl: repositoryUrl
    branch: branch
  }
}

module functionApp 'modules/function-app.bicep' = {
  name: 'func-${environment}'
  params: {
    environment: environment
    location: location
    storageAccountName: tableStorage.outputs.storageAccountName
    storageAccountKey: tableStorage.outputs.storageAccountKey
  }
}

module tableStorage 'modules/table-storage.bicep' = {
  name: 'storage-${environment}'
  params: {
    environment: environment
    location: location
  }
}

module aiFoundry 'modules/ai-foundry.bicep' = {
  name: 'ai-${environment}'
  params: {
    environment: environment
    location: location
  }
}

output staticWebAppName string = staticWebApp.outputs.staticWebAppName
output staticWebAppHostname string = staticWebApp.outputs.defaultHostname
output functionAppName string = functionApp.outputs.functionAppName
output storageAccountName string = tableStorage.outputs.storageAccountName
output aiAccountName string = aiFoundry.outputs.aiAccountName
