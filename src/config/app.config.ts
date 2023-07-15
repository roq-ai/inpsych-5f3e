interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Healthcare Provider'],
  customerRoles: [],
  tenantRoles: ['Healthcare Provider'],
  tenantName: 'Account',
  applicationName: 'Inpsych',
  addOns: ['chat', 'notifications'],
};
