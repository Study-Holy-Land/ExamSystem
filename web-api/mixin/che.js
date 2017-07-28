module.exports = (name) => {
  return {
    'environments': {
      'java_runtime': {
        'machines': {
          'dev-machine': {
            'attributes': {
              'memoryLimitBytes': '1073741824'
            },
            'servers': {},
            'agents': [
              'org.eclipse.che.terminal',
              'org.eclipse.che.ws-agent',
              'org.eclipse.che.ssh'
            ]
          }
        },
        'recipe': {
          'location': 'eclipse/ubuntu_jdk8',
          'type': 'dockerimage'
        }
      }
    },
    'defaultEnv': 'java_runtime',
    'name': name,
    'commands': [
      {
        'commandLine': 'mvn clean install -f ${current.project.path}',
        'name': 'build',
        'attributes': {},
        'type': 'mvn'
      }
    ]

  };
};
