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
  readonly licenses: IssueLicense[];
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

export interface IssueLicense extends Issue {
  title: string;
}
