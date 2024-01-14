export interface Government {
    entity_uuid: string,
    name: string,
    description: string,
    image_url: string, 
}

export interface Party {
    entity_uuid: string,
    name: string,
    description: string,
    image_url: string, 
}

export interface PartyMember {
    entity_uuid: string,
    name: string,
    description: string,
    image_url: string, 
}

export interface PartyToGovernment {
    id: number,
    party_uuid: string,
    government_uuid: string,
}

export interface PartyMemberToParty {
    id: number,
    party_member_uuid: string,
    party_uuid: string,
}

export interface Article {
    entity_uuid: string,
    title: string,
    url: string,
    date: string, 
    description: string,
    image_url: string, 
    rating: number,
    creation_date: string,
}

export interface PartyAndGovernment {
    party_uuid: string,
    government_uuid: string,
}

export interface PartyMemberAndParty {
    id: number,
    party_member_uuid: string,
    party_uuid: string,
}

export interface PartyMemberAndGovernment {
    id: number,
    party_member_uuid: string,
    government_uuid: string,
}

export interface EntityAndArticle {
    id: number,
    entity_uuid: string,
    article_uuid: string,
}

export enum EntityType {
    government = 1,
    party,
    partyMember,
}

export interface APIResult {
    data: any | undefined, 
    error: string | undefined
}