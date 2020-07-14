import * as fetchMock from "fetch-mock";

import {
  exportItem, IExportItemResponse
} from "../../src/items/export";

import { ItemSuccessResponse } from "../mocks/items/item";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { encodeParam } from "@esri/arcgis-rest-request";

describe("exportItem", () => {
  afterEach(fetchMock.restore);

  describe("Authenticated methods", () => {
    const authentication = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
      username: "moses",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    it("should export an item using supplied owner", done => {
      const mockResponse: IExportItemResponse = {
        type: 'CSV',
        size: 100,
        jobId: 'n0n0',
        exportItemId: 'm0m0',
        serviceItemId: '5u4i',
        exportFormat: 'CSV'
      };

      fetchMock.once("*", mockResponse);

      exportItem({
        id: 'g33M1k3',
        owner: 'geemike',
        exportFormat: 'CSV',
        exportParameters: {
          layers: [
            { id: 0 },
            { id: 1, where: 'POP1999 > 100000' }
          ]
        },
        authentication,
      }).then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/geemike/export"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should export an item using supplied owner", done => {
      const mockResponse: IExportItemResponse = {
        type: 'CSV',
        size: 100,
        jobId: 'n0n0',
        exportItemId: 'm0m0',
        serviceItemId: '5u4i',
        exportFormat: 'CSV'
      };

      fetchMock.once("*", mockResponse);

      exportItem({
        id: 'g33M1k3',
        exportFormat: 'CSV',
        exportParameters: {
          layers: [
            { id: 0 },
            { id: 1, where: 'POP1999 > 100000' }
          ]
        },
        authentication,
      }).then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/moses/export"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));

          done();
        })
        .catch(e => {
          fail(e);
        });
    });    
  });
});