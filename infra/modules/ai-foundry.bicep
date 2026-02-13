@description('Environment name')
param environment string

@description('Location for the resource')
param location string

var aiAccountName = 'betterday-ai-${environment}'

resource aiAccount 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: aiAccountName
  location: location
  kind: 'OpenAI'
  sku: {
    name: 'S0'
  }
  properties: {
    customSubDomainName: aiAccountName
    publicNetworkAccess: 'Enabled'
  }
}

resource gptDeployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  parent: aiAccount
  name: 'gpt-4o-mini'
  sku: {
    name: 'GlobalStandard'
    capacity: 10
  }
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o-mini'
      version: '2024-07-18'
    }
  }
}

output aiAccountName string = aiAccount.name
output aiEndpoint string = aiAccount.properties.endpoint
