 const KhefuePointsToNairaConversionRate = 10; // 1 Khefue Point = 100 Naira


 export const pointsToNaira = (points: number|string): number => {
     const numericPoints = typeof points === "string" ? parseFloat(points) : points;
     return numericPoints * KhefuePointsToNairaConversionRate;
 };


 export const nairaToPoints = (naira: number|string): number => {
     const numericNaira = typeof naira === "string" ? parseFloat(naira) : naira;
     return numericNaira / KhefuePointsToNairaConversionRate;
 };