import {filter, Observable, OperatorFunction, pipe, UnaryFunction} from "rxjs";

/**
 * operator that will filter all null/undefined values from observable
 */
export function filterNullish<T>(): UnaryFunction<Observable<T | null | undefined>, Observable<T>> {
    return pipe(
        filter(x => x != null) as OperatorFunction<T | null |  undefined, T>
    );
}
