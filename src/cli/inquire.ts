import { prompt, Question } from 'inquirer';
import { Runner, TypescriptStarterCLIOptions, validateName } from './utils';

export async function inquire(): Promise<TypescriptStarterCLIOptions> {
  const packageNameQuestion: Question = {
    filter: (answer: string) => answer.trim(),
    message: '📦 Enter the new package name:',
    name: 'projectName',
    type: 'input',
    validate: validateName
  };

  enum ProjectType {
    Node = 'node',
    Library = 'lib'
  }
  const projectTypeQuestion: Question = {
    // tslint:disable-next-line:readonly-array
    choices: [
      { name: 'Node.js application', value: ProjectType.Node },
      { name: 'Javascript library', value: ProjectType.Library }
    ],
    message: '🔨 What are you making?',
    name: 'type',
    type: 'list'
  };

  const packageDescriptionQuestion: Question = {
    filter: (answer: string) => answer.trim(),
    message: '💬 Enter the package description:',
    name: 'description',
    type: 'input',
    validate: (answer: string) => answer.length > 0
  };

  const runnerQuestion: Question = {
    // tslint:disable-next-line:readonly-array
    choices: [
      { name: 'npm', value: Runner.Npm },
      { name: 'yarn', value: Runner.Yarn }
    ],
    message: '🚄 Will this project use npm or yarn?',
    name: 'runner',
    type: 'list'
  };

  enum TypeDefinitions {
    none = 'none',
    node = 'node',
    dom = 'dom',
    nodeAndDom = 'both'
  }

  const typeDefsQuestion: Question = {
    // tslint:disable-next-line:readonly-array
    choices: [
      {
        name: `None — the library won't use any globals or modules from Node.js or the DOM`,
        value: TypeDefinitions.none
      },
      {
        name: `Node.js — parts of the library require access to Node.js globals or built-in modules`,
        value: TypeDefinitions.node
      },
      {
        name: `DOM — parts of the library require access to the Document Object Model (DOM)`,
        value: TypeDefinitions.dom
      },
      {
        name: `Both Node.js and DOM — some parts of the library require Node.js, other parts require DOM access`,
        value: TypeDefinitions.nodeAndDom
      }
    ],
    message: '📚 Which global type definitions do you want to include?',
    name: 'definitions',
    type: 'list',
    when: (answers: any) => answers.type === ProjectType.Library
  };

  enum Extras {
    appveyor = 'appveyor',
    circleci = 'circleci',
    editorconfig = 'editorconfig',
    jscpd = 'jscpd',
    immutable = 'immutable',
    strict = 'strict',
    travis = 'travis',
    vscode = 'vscode'
  }
  const extrasQuestion: Question = {
    // tslint:disable-next-line:readonly-array
    choices: [
      {
        name: 'Enable stricter type-checking',
        value: Extras.strict
      },
      {
        checked: true,
        name: 'Enable tslint-immutable',
        value: Extras.immutable
      },
      {
        checked: true,
        name: 'Include .editorconfig',
        value: Extras.editorconfig
      },
      {
        checked: true,
        name: 'Include VS Code debugging config',
        value: Extras.vscode
      },
      {
        checked: true,
        name: 'Include CircleCI config',
        value: Extras.circleci
      },
      {
        checked: false,
        name: 'Include Appveyor (Windows-based CI) config',
        value: Extras.appveyor
      },
      {
        checked: false,
        name: 'Include Travis CI config',
        value: Extras.travis
      },
      {
        checked: false,
        name: 'Enable Copy/Paste detection',
        value: Extras.jscpd
      }
    ],
    message: '🚀 More fun stuff:',
    name: 'extras',
    type: 'checkbox'
  };

  return prompt([
    packageNameQuestion,
    projectTypeQuestion,
    packageDescriptionQuestion,
    runnerQuestion,
    typeDefsQuestion,
    extrasQuestion
  ]).then(answers => {
    const {
      definitions,
      description,
      extras,
      projectName,
      runner,
      type
    } = answers as {
      readonly definitions?: TypeDefinitions;
      readonly description: string;
      readonly extras: ReadonlyArray<string>;
      readonly projectName: string;
      readonly runner: Runner;
      readonly type: ProjectType;
    };
    return {
      appveyor: extras.includes(Extras.appveyor),
      circleci: extras.includes(Extras.circleci),
      description,
      domDefinitions: definitions
        ? [TypeDefinitions.dom, TypeDefinitions.nodeAndDom].includes(
            definitions
          )
        : false,
      editorconfig: extras.includes(Extras.editorconfig),
      immutable: extras.includes(Extras.immutable),
      install: true,
      jscpd: extras.includes(Extras.jscpd),
      nodeDefinitions: definitions
        ? [TypeDefinitions.node, TypeDefinitions.nodeAndDom].includes(
            definitions
          )
        : type === ProjectType.Node,
      projectName,
      runner,
      strict: extras.includes(Extras.strict),
      travis: extras.includes(Extras.travis),
      vscode: extras.includes(Extras.vscode)
    };
  });
}
