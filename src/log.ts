enum Severity {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
}

const log = (severity: Severity, ...content: any) => {
  console.log(severity, content)
}

export { log, Severity }
