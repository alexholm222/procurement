export const sortByDefault = (array) => {
    array.sort(function (a, b) {
        const A = a.by_default;
        const B = b.by_default;
        
        if (A < B) {
            return 1
        }

        if (A > B) {
            return -1
        }

        if (A == B) {
            return 0
        }
    })
}