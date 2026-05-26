export interface RutValidationResult{
    isValid: boolean;
    formatted:string;
    clean:string;
    dv:string;
    error?:string;
}

export function cleanRut(rut: string): string{
    return rut.replace(/\./g,'').replace(/-/g, '').replace(/\s/g, '');
}

export function formatRut(rut:string):string{
    const cleaned = cleanRut(rut);
    if(cleaned.length <2) return cleaned;

    const body = cleaned.slice(0,-1);
    const dv = cleaned.slice(-1).toUpperCase();

    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedBody}-${dv}`;
}

function calculateDv(body: string): string{
    let sum = 0;
    let multiplier = 2;

    for(let i = body.length -1; i >= 0; i--){
        sum += parseInt(body[i], 10) * multiplier;
        multiplier = multiplier == 7?2: multiplier+1;
    }

    const remainder = 11 - (sum%11);
    if(remainder===11)return'0';
    if(remainder===10)return'K';
    return remainder.toString();
}

function invalidResult(rut: string, cleaned: string, error: string): RutValidationResult{
    return{
        isValid: false,
        formatted: formatRut(rut),
        clean: cleaned,
        dv: cleaned.length>0? cleaned.slice(-1).toUpperCase():'',
        error,
    };
}

export function validateRut(rut:string): RutValidationResult{
    const cleaned = cleanRut(rut);

    if(!/^\d{7,8}[\dkK]$/.test(cleaned)){
        return invalidResult(rut, cleaned, 'Formato de Rut invalido. Use xx.xxx.xxx-x');
    }
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1).toUpperCase();
    const expectedDv = calculateDv(body);

    if(dv !== expectedDv){
        return invalidResult(rut, cleaned, 'Digito verificador invalido');
    }

    return{
        isValid: true,
        formatted: formatRut(rut),
        clean: cleaned,
        dv,
    };
}