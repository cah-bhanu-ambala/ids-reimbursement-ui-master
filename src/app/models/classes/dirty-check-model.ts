import {Observable} from 'rxjs';

export declare interface DirtyCheckModel {
  canDeactivate: () => boolean | Observable<boolean>;
}

