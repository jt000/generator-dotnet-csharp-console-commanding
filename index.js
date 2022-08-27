const Generator = require('yeoman-generator');
var ejs = require('ejs');
const path = require('path');
const glob = require('glob');
const isValidPath = require('is-valid-path');

module.exports = class extends Generator {

  params = {};

  constructor(args, opts) {
    super(args, opts);

    this.option('generate', {
      type: Boolean,
      hide: true,
      description: 'Generate the template.json from the templates files.',
      default: false
    });
  }

  initializing() {
    Object.assign(this.params, { generate: this.options['generate'] });
  }

  async prompting() {
    if (this.params.generate) {
      return;
    }

    const answers = await this.prompt([
      {
        type: "input",
        name: "solutionName",
        message: "Your Solution's name",
        validate: (i) => this._isNotEmptyString(i),
        store: true
      },
      {
        type: "input",
        name: "projectName",
        message: "Your Project's name",
        default: (p) => p.solutionName,
        validate: (i) => this._isNotEmptyString(i)
      }
    ]);

    Object.assign(this.params, answers);
  }

  configuring() {
    if (this.params.generate) {
      return;
    }
  }

  async writing() {
    if (this.params.generate) {
      const config = { files: [] };
      glob.sync(path.join(this.sourceRoot(), "**/*.*"))
          .forEach(f => {
            const localSrc = path.relative(this.sourceRoot(), f);
            config.files.push({
              source: localSrc,
              destination: localSrc
            });
          });
        this.writeDestinationJSON(path.join(this.sourceRoot(), "../templates.json"), config);
    } else {
      // Read templated templates.json
      const config = await this._readConfigJSON();
      
      // Render templates listed
      await this.renderTemplates(config.files, this.params);
    }
  }

  async install() {
    if (this.params.generate) {
      return;
    }

    await this.spawnCommand("dotnet", ["restore", `${this.params.projectName}.csproj`], { cwd: this.params.projectName });
  }

  _isNotEmptyString(i, minLength) {
    minLength = minLength || 1;

    if (typeof i !== 'string') return 'Input is not a valid string.';
    if (i.length < minLength) return `Input length must be at least ${minLength} character(s).`;

    return true;
  }

  _isValidGuid(i) {
    const regEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!regEx.test(i)) return 'Input must be a valid GUID. For example: 00000000-0000-0000-0000-000000000000.'

    return true;
  }

  _isValidDirectoryName(i) {
    const pathInfo = path.parse(i);
    if (pathInfo.root !== '') return 'Path must not be absolute. Do not start with a drive or "\\".';
    if (pathInfo.dir !== '') return 'Path must not be nested in a parent directory.';
    if (!isValidPath(i)) return 'Path contains invalid characters';

    return true;
  }

  async _readConfigJSON() {
    const templatesJsonPath = path.join(this.sourceRoot(), "../templates.json");
    let json = this.fs.read(templatesJsonPath);

    json = await ejs.render(json, this.params, { async: true });
    const config = JSON.parse(json);

    return config;
  }
};