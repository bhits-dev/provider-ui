import {Injectable} from "@angular/core";
import {Http, Response, URLSearchParams} from "@angular/http";
import {ApiUrlService} from "../../shared/api-url.service";
import {ExceptionService} from "../../shared/exception.service";
import {Observable} from "rxjs/Observable";
import {SampleDocumentInfo} from "./sample-document-info.model";
import {TryPolicyResponse} from "./try-policy-response.model";

@Injectable()
export class TryPolicyService {

  constructor(private http: Http,
              private apiUrlService: ApiUrlService,
              private exceptionService: ExceptionService,) {
  }

  public getSampleDocuments(): Observable<SampleDocumentInfo[]> {
    const resourceUrl = this.apiUrlService.getTryPolicyBaseUrl().concat("/sampleDocuments");
    return this.http.get(resourceUrl)
      .map((resp: Response) => <SampleDocumentInfo[]>(resp.json()))
      .catch(this.exceptionService.handleError);
  }

  public applyTryPolicyUseSampleDoc(patientMrn: string, consentId: number, documentId: string, purposeOfUseCode: string): Observable<TryPolicyResponse> {
    const resourceUrl = this.apiUrlService.getTryPolicyBaseUrl()
      .concat("/tryPolicyXHTML/" + patientMrn);
    let params: URLSearchParams = new URLSearchParams();
    params.set('consentId', consentId.toString());
    params.set('documentId', documentId);
    params.set('purposeOfUseCode', purposeOfUseCode);

    return this.http.get(resourceUrl, {search: params})
      .map((resp: Response) => <TryPolicyResponse>(resp.json()))
      .catch(this.exceptionService.handleError);
  }

  public handleApplyTryPolicySuccess(tryPolicyResponse: TryPolicyResponse): void {
    let decodedDocument = this.based64DecodedUnicode(tryPolicyResponse.document);
    let viewer = window.open('', '_blank');
    viewer.document.open().write(decodedDocument);
  }

  // Deal with non-ASCII characters of Spanish
  private based64DecodedUnicode(str): string {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }
}
