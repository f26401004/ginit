const _ = require('lodash')
const fs = require('fs')
const git = require('simple-git')()
const CLI = require('clui')
const spinner = CLI.Spinner

const inquirer = require('./inquirer')
const gh = require('./github')

module.exports = {
  githubAuth : (token) => {
    octokit.authenticate({
      type : 'oauth',
      token : token
    });
  },
  getStoredGithubToken : () => {
    return conf.get('github.token');
  },
  createRemoteRepo: () => {
    const github = gh.getInstance()
    const answers = await inquirer.askRepoDetails()
    const params = {
      name: answers.name,
      description: answer.description,
      private: (answers.visibility === 'private')
    }
    const status = new spinner('Creating remote repository...')
    status.start()
    try {
      const response = await github.repos.create(params)
      return response.data.ssh_url
    } catch (error) {
      throw error
    } finally {
      status.stop()
    }
  },
  createGitignore: () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore')
    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist)
      if (answers.ignore.length) {
        fs.writeFileSync('.gitignore', answers.ignore.join('\n'))
      } else {
        touch('.gitignore')
      }
    } else {
      touch('.gitignore')
    }
  },
  setupRepo: async (url) => {
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();
    try {
      await git
        .init()
        .add('.gitignore')
        .add('./*')
        .commit('Initial commit')
        .addRemote('origin', url)
        .push('origin', 'master');
      return true;
    } catch(err) {
      throw err;
    } finally {
      status.stop();
    }
  }
}