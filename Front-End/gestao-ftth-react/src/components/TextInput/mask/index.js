export const DateMask = (event) => {
    let input = event.target.value;

    // Remove any non-digit characters
    input = input.replace(/\D/g, '');

    // Format the date as dd/mm/yyyy
    if (input.length <= 2) {
        input = input;
    } else if (input.length <= 4) {
        input = `${input.slice(0, 2)}/${input.slice(2)}`;
    } else {
        input = `${input.slice(0, 2)}/${input.slice(2, 4)}/${input.slice(4, 8)}`;
    }

    return input
}