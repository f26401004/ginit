const octokit = require('@octokit/rest')()
const configstore = require('configstore')
const pkg = require('../package.json')
const _ = require('lodash')
const CLI = require('clui')
const spinner = CLI.Spinner
const chalk = require('chalk')

const inquirer = require('./inquirer')
const config = new configstore(pkg.name)

module.exports = {
  getInstance: () => octokit,
  getStoredGithubToken: () => config.get('github.token'),
  setGithubCredentials: async () => {
    const credentials = await inquirer.askGithubCredentials()
    console.log(credentials)
    octokit.authenticate(
      _.extend(
        {
          type: 'basic'
        },
        credentials
      )
    )
  },
  registerNewToken: async () => {
    const status = new spinner('Authenticating you, please waiting...')
    status.start()
    try {
      const response = await octokit.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'ginits, the command-line tool for initializing Git repos.'
      })
      const token = response.data.token
      if (token) {
        config.set('github.token', token)
        return token
      }
      throw new Error('Missing Token', "Github token was not found in the response")
    } catch (error) {
      throw error
    } finally {
      status.stop()
    }
  }
}