import { useMemo } from "react";

export function useMergeRefs<T>(...refs: (React.Ref<T> | undefined)[]) {
    return useMemo(() => {
        if (refs.every((ref) => ref == null)) {
            return null;
        }

        return (node: T) => {
            refs.forEach((ref) => {
                if (ref) {
                    if (typeof ref === "function") {
                        ref(node);
                    } else if (typeof ref === "object" && "current" in ref) {
                        (ref as React.MutableRefObject<T | null>).current = node;
                    }
                }
            });
        };
    }, refs);
}
