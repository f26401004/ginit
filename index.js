const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const configstore = require('configstore')
const config = new configstore('ginit')

const files = require('./lib/files')
const github = require('./lib/github')

clear()
console.log(
  chalk.yellow(figlet.textSync('Ginit', {horizontalLayout: 'full'}))
)

if (files.directoryExisits('.git')) {
  console.log(chalk.red('Already a git repository!!'))
  process.exit()
}

const getGithubToken = async () => {
  // Fetch token from config store
  let token = github.getStoredGithubToken();
  if (token) {
    return token;
  }
  // No token found, use credentials to access GitHub account
  await github.setGithubCredentials();
  // register new token
  token = await github.registerNewToken();
  return token;
}

const run = async () => {
  try {
    // Retrieve & Set Authentication Token
    const token = await getGithubToken();
    github.githubAuth(token);
    // Create remote repository
    const url = await repo.createRemoteRepo();
    // Create .gitignore file
    await repo.createGitignore();
    // Set up local repository and push to remote
    const done = await repo.setupRepo(url);
    if(done) {
      console.log(chalk.green('All done!'));
    }
  } catch(err) {
    if (err) {
      switch (err.code) {
        case 401:
          console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
          break;
        case 422:
          console.log(chalk.red('There already exists a remote repository with the same name'));
          break;
        default:
          console.log(err);
      }
    }
  }
}

run()