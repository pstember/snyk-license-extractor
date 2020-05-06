export interface Project {
  readonly name: string;
  readonly id: string;
}

export interface Org {
  readonly name: string;
  readonly id: string;
  readonly slug: string;
}

export interface Issues {
  readonly vulnerabilities: Vulnerability[];
  readonly licenses: EmbeddedLicense[];
}

export interface Issue {
  readonly id: string;
}

export interface Vulnerability extends Issue {
  readonly id: string;
  readonly severity: Severity;
  readonly isUpgradable: boolean;
  readonly isPinnable: boolean;
  readonly isPatchable: boolean;
  readonly isIgnored: boolean;
}

export interface License {
  readonly id: string;
  readonly projects: Project[];
}

export type Severity = 'low' | 'medium' | 'high';

export interface EmbeddedLicense extends Issue {
  title: string;
  license: string;
}

export interface Dependency {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly licenses :EmbeddedLicense[];
  readonly projects: Project[];
  readonly copyright: string[];
}