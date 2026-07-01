import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { spfi, SPFx } from '@pnp/sp';

import TimBitApp from './components/TimBitApp';
import { ITimBitAppProps } from './components/TimBitApp';

export interface ITimBitWebPartProps {
  adminEmails: string;
  distributionList: string;
}

export default class TimBitWebPart extends BaseClientSideWebPart<ITimBitWebPartProps> {
  private _sp: ReturnType<typeof spfi>;

  protected async onInit(): Promise<void> {
    this._sp = spfi().using(SPFx(this.context));
  }

  public render(): void {
    const currentUserEmail = this.context.pageContext.user.email.toLowerCase();
    const adminList = (this.properties.adminEmails || '')
      .split(',')
      .map((e: string) => e.trim().toLowerCase())
      .filter(Boolean);
    const isAdmin = adminList.includes(currentUserEmail);

    const element: React.ReactElement<ITimBitAppProps> = React.createElement(TimBitApp, {
      sp: this._sp,
      isAdmin,
      distributionList: this.properties.distributionList || ''
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: { description: 'Tim·bit History Settings' },
          groups: [
            {
              groupName: 'Admin Access',
              groupFields: [
                PropertyPaneTextField('adminEmails', {
                  label: 'Admin Emails (comma-separated)',
                  description: 'Users who can add, edit, and publish Tim·bit entries',
                  multiline: true,
                  rows: 3
                })
              ]
            },
            {
              groupName: 'Email Settings',
              groupFields: [
                PropertyPaneTextField('distributionList', {
                  label: 'Distribution List Email',
                  description: 'Pre-populated in the To field when generating the weekly email',
                  placeholder: 'e.g. hpe-networking-sales@hpe.com'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
