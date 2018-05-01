/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use strict';

var CORE_NAMESPACE_PREFIX = "hansung.ac.kr";
var PARTICIPANTS = "participants";
var ASSETS = "assets";
var TRANSACTION = "transaction";
var RESUME = "ResumeInfoUser";

var NAMESPACE_PARTICIPANTS = CORE_NAMESPACE_PREFIX + "." + PARTICIPANTS;
var NAMESPACE_USER = CORE_NAMESPACE_PREFIX + "." + PARTICIPANTS + "." + "User";
var NAMESPACE_ORG = CORE_NAMESPACE_PREFIX + "."  + PARTICIPANTS + "." + "Organization";
var NAMESPACE_ENT = CORE_NAMESPACE_PREFIX + "."  + PARTICIPANTS + "." + "Enterprise";
var NAMESPACE_INS = CORE_NAMESPACE_PREFIX + "."  + PARTICIPANTS + "." + "School";

var NAMESAPCE_ASSETS = CORE_NAMESPACE_PREFIX + "." + ASSETS;
var ASSET_RESUME_INFO_USER =CORE_NAMESPACE_PREFIX + "."  + ASSETS + "." + "ResumeInfoUser";
var ASSET_CERTIFICATE =CORE_NAMESPACE_PREFIX + "."  + ASSETS + "." + "Certificate";
var ASSET_AWARD_DETAILS =CORE_NAMESPACE_PREFIX + "."  + ASSETS + "." + "AwardDetails";
var USER_INFO_IN_ENT =CORE_NAMESPACE_PREFIX + "."  + ASSETS + "." + "UserInfoInEnt";
var USER_INFO_IN_SCH =CORE_NAMESPACE_PREFIX + "."  + ASSETS+ "." + "UserInfoInSch";


var NAMESPACE_EVENT_OR_TRANSACTION = CORE_NAMESPACE_PREFIX + "." + TRANSACTION ;







/**
 * @param {hansung.ac.kr.transaction.selectUserByCertificateName}  tx  - the member to be processed
 * @transaction
 */
function selectUserByCertificateName (tx) {
  var idList = [];

  // 선택된 결과가 많아질경우 이코드는 문제가 있음 수정필요
  query("selectCertificateByName" , {targetName: tx.certificateName })
  .then(function (certificateList) {
     certificateList.forEach(function (certificate) {
     idList.push(certificate.ownerId);
     })
  }).then(function () {
     idList.forEach(function (id) {
        query("selectUserById" , {targetId: id })
        .then(function (userList){
         console.log(userList); 
        });
     })
  });

}


/**
 * @param {hansung.ac.kr.transaction.selectResumeInfoUser}  tx  - the member to be processed
 * @transaction
 */
function selectResumeInfoUser (tx) {
  var me = getCurrentParticipant();
  query("selectResumeInfoUser" , {resumeAssetId: "ResumeAssetInfoUser" + me.getIdentifier() })
  .then(function (resume) {
  console.log(resume);
  })

}

/**
 * @param {hansung.ac.kr.transaction.selectMyCertificate}  tx  - the member to be processed
 * @transaction
 */
function selectMyCertificate (tx) {
  var me = getCurrentParticipant();
  var result = query("selectMyCertificate" , {CurrentUserId: me.getIdentifier() });
  console.log(result);
}

/**
 * @param {hansung.ac.kr.transaction.selectMyAwardDetails}  tx  - the member to be processed
 * @transaction
 */
function selectMyAwardDetails (tx) {
  var me = getCurrentParticipant();
  var result = query("selectMyAwardDetails" , {CurrentUserId: me.getIdentifier() });
  console.log(result);
}

/**
 * @param {hansung.ac.kr.transaction.selectMyUserInfoInEnt}  tx  - the member to be processed
 * @transaction
 */
function selectMyUserInfoInEnt (tx) {
  var me = getCurrentParticipant();
  var result = query("selectMyUserInfoInEnt" , {CurrentUserId: me.getIdentifier() });
  console.log(result);
}

/**
 * @param {hansung.ac.kr.transaction.selectMyUserInfoInSch}  tx  - the member to be processed
 * @transaction
 */
function selectMyUserInfoInSch (tx) {
  var me = getCurrentParticipant();
  var result = query("selectMyUserInfoInSch" , {CurrentUserId: me.getIdentifier() });
  console.log(result);
}




/**
 * @param {hansung.ac.kr.transaction.CreateCertificate}  txCreateCertificate  - the member to be processed
 * @transaction
 */
function CreateCertificate (txCreateCertificate) {
   var actionDateTime = new Date();
   var me = getCurrentParticipant();
   var factory = getFactory();

   if(!me) {
        throw new Error('can not find Participant');
    }

   return getAssetRegistry(ASSET_CERTIFICATE)
  .then(function (allCertificateRegistry) {

       // math.random은 완전한 난수를 보장하지 않기 때문에 보안에 안좋음, crypto 모듈 참고
       var newCertificate = factory.newResource(NAMESAPCE_ASSETS, "Certificate",  me.getIdentifier() + getRandomIntInclusive(1, 100000000000) );

       newCertificate.ownerId = me.getIdentifier();
       newCertificate.certificateName = txCreateCertificate.certificateName;
       newCertificate.certificateScore = txCreateCertificate.certificateScore;
       newCertificate.organizationId  = txCreateCertificate.organizationId ;
       newCertificate.organizationName  = txCreateCertificate.organizationName ;
       newCertificate.dob  = txCreateCertificate.dob ;
       newCertificate.expirationDate  = txCreateCertificate.expirationDate;
       newCertificate.transactionTime  = actionDateTime;
       newCertificate.isPublic  = txCreateCertificate.isPublic;

       return allCertificateRegistry.add(newCertificate);
   })
  .catch(function (error){
   	throw error;
   });
}



/**
 * @param {hansung.ac.kr.transaction.CreateAwardDetails}  txCreateAwardDetails  - the member to be processed
 * @transaction
 */
function CreateAwardDetails (txCreateAwardDetails) {
   var actionDateTime = new Date();
   var me = getCurrentParticipant();
   var factory = getFactory();

   if(!me) {
        throw new Error('can not find Participant');
    }

   return getAssetRegistry(ASSET_AWARD_DETAILS)
  .then(function (allAwardDetailsRegistry) {

       var newAwardDetails = factory.newResource(NAMESAPCE_ASSETS, "AwardDetails", me.getIdentifier() + getRandomIntInclusive(1, 100000000000)  );
     
       newAwardDetails.ownerId = me.getIdentifier();
       newAwardDetails.contestName = txCreateAwardDetails.contestName;
       newAwardDetails.organizationId  = txCreateAwardDetails.organizationId ;
       newAwardDetails.organizationName  = txCreateAwardDetails.organizationName ;
       newAwardDetails.dateOfAward  = txCreateAwardDetails.dateOfAward ;
       newAwardDetails.awardGrade  = txCreateAwardDetails.awardGrade;
       newAwardDetails.description  = txCreateAwardDetails.description;
       newAwardDetails.transactionTime  = actionDateTime;
       newAwardDetails.isPublic  = txCreateAwardDetails.isPublic;

       return allAwardDetailsRegistry.add(newAwardDetails);
   })
  .catch(function (error){
   	throw error;
   });
}




/**
 * @param {hansung.ac.kr.transaction.CreateUserInfoInEnt}  txCreateUserInfoInEnt  - the member to be processed
 * @transaction
 */
function CreateUserInfoInEnt (txCreateUserInfoInEnt) {
   var actionDateTime = new Date();
   var me = getCurrentParticipant();
   var factory = getFactory();

   if(!me) {
        throw new Error('can not find Participant');
    }

   return getAssetRegistry(USER_INFO_IN_ENT)
  .then(function (allUserInfoInEntRegistry) {

       var newUserInfoInEnt = factory.newResource(NAMESAPCE_ASSETS, "UserInfoInEnt", me.getIdentifier() + getRandomIntInclusive(1, 100000000000)  );
     
     
       newUserInfoInEnt.ownerId = me.getIdentifier();
       newUserInfoInEnt.enterpriseId  = txCreateUserInfoInEnt.enterpriseId ;
       newUserInfoInEnt.enterpriseName  = txCreateUserInfoInEnt.enterpriseName ;
       newUserInfoInEnt.userPosition  = txCreateUserInfoInEnt.userPosition ;
       newUserInfoInEnt.performingTask  = txCreateUserInfoInEnt.performingTask;
       newUserInfoInEnt.dateOfEmployment  = txCreateUserInfoInEnt.dateOfEmployment;
       newUserInfoInEnt.retirementDate  = txCreateUserInfoInEnt.retirementDate;
       newUserInfoInEnt.transactionTime = actionDateTime;
       newUserInfoInEnt.isPublic  = txCreateUserInfoInEnt.isPublic;
  
       return allUserInfoInEntRegistry.add(newUserInfoInEnt);
   })
  .catch(function (error){
   	throw error;
   });
}





/**
 * @param {hansung.ac.kr.transaction.CreateUserInfoInSch}  txCreateUserInfoInSch  - the member to be processed
 * @transaction
 */
function CreateUserInfoInSch (txCreateUserInfoInSch) {
   var actionDateTime = new Date();
   var me = getCurrentParticipant();
   var factory = getFactory();

   if(!me) {
        throw new Error('can not find Participant');
    }

   return getAssetRegistry(USER_INFO_IN_SCH)
  .then(function (allUserInfoInSchRegistry) {

       var newUserInfoInSch = factory.newResource(NAMESAPCE_ASSETS, "UserInfoInSch", me.getIdentifier() + getRandomIntInclusive(1, 100000000000)  );
     
       newUserInfoInSch.ownerId = me.getIdentifier();
       newUserInfoInSch.schoolId  = txCreateUserInfoInSch.schoolId ;
       newUserInfoInSch.schoolName  = txCreateUserInfoInSch.schoolName ;
       newUserInfoInSch.entranceDate  = txCreateUserInfoInSch.entranceDate ;
       newUserInfoInSch.graduationDate  = txCreateUserInfoInSch.graduationDate;
       newUserInfoInSch.majorField  = txCreateUserInfoInSch.majorField;
       newUserInfoInSch.gradeAverage  = txCreateUserInfoInSch.gradeAverage;
       newUserInfoInSch.transactionTime = actionDateTime;
       newUserInfoInSch.isPublic  = txCreateUserInfoInSch.isPublic;

       return allUserInfoInSchRegistry.add(newUserInfoInSch);
   })
  .catch(function (error){
   	throw error;
   });
}





/**
 * @param {hansung.ac.kr.transaction.CreateResumeInfoUser}  txCreateResumeInfoUser  - the member to be processed
 * @transaction
 */
function CreateResumeInfoUser (txCreateResumeInfoUser) {

   var me = getCurrentParticipant();
   var allResume = null;
   var factory = getFactory();

   if(!me) {
        throw new Error('can not find Participant');
    }

   return getAssetRegistry(ASSET_RESUME_INFO_USER)
  .then(function (allResumeAssetRegistry) {
     allResume = allResumeAssetRegistry;

       var newResumeAsset = factory.newResource(NAMESAPCE_ASSETS, RESUME, "ResumeAssetInfoUser" + me.getIdentifier() );

       newResumeAsset.dob = txCreateResumeInfoUser.dob;
       newResumeAsset.supportField = txCreateResumeInfoUser.supportField;
       newResumeAsset.salaryRequirement  = txCreateResumeInfoUser.salaryRequirement ;
       newResumeAsset.majorActivities  = txCreateResumeInfoUser.majorActivities ;
       newResumeAsset.socialExperience  = txCreateResumeInfoUser.socialExperience ;
       newResumeAsset.skillsAndCapabilities  = txCreateResumeInfoUser.skillsAndCapabilities ;
       newResumeAsset.isPublic  = txCreateResumeInfoUser.isPublic ;

       return allResume.add(newResumeAsset);
   })
  .catch(function (error){
   	throw error;
   });
}


/**
 * @param {hansung.ac.kr.transaction.AddRequestUser} addRequestUser - the authorize to be processed
 * @transaction
 */
function addRequestUser(addRequestUser) {

    var me = getCurrentParticipant();
    var meType = null;
    var index = -1;
    var evetType = null;

    if(!me) {
        throw new Error('getCurrentParticipant is null');
    }

    if(me.getFullyQualifiedType() === NAMESPACE_ORG) {
        meType = NAMESPACE_ORG;
        evetType = "OrganizationEvent"
    }

    else if(me.getFullyQualifiedType() === NAMESPACE_ENT) {
        meType = NAMESPACE_ENT;
        evetType = "OrganizationEvent"
    }

    else if(me.getFullyQualifiedType() === NAMESPACE_INS) {
        meType = NAMESPACE_INS;
        evetType = "OrganizationEvent"
    }

    if(!me.requestUser) {
        me.requestUser = [];
    }
    else {
        me.requestUser.findIndex(function getIndex(element, indexf, array) {
         if(element.getIdentifier() == addRequestUser.userId)
           index = indexf;
        });
    }

     if(index < 0) {
        me.requestUser.push(addRequestUser.user);

        return getParticipantRegistry(meType)
        .then(function (participantsRegistry) {
            /*
            // emit an event
            var event = getFactory().newEvent(NAMESPACE_EVENT_OR_TRANSACTION, evetType);
            event.txForUser = addRequestUser;
            emit(event);
            // persist the state of the member
            */
            return participantsRegistry.update(me);
        });
    }
  	else throw "Same Id already exist";

}

/**
 * @param {hansung.ac.kr.transaction.RevokeRequestUser} revokeRequestUser - the authorize to be processed
 * @transaction
 */
function revokeRequestUser(revokeRequestUser) {


      var me = getCurrentParticipant();
      var meType = null;
  	  var index = -1;

  	  if(!me) {
          throw new Error('getCurrentParticipant is null');
      }

  	  me.requestUser.findIndex(function testF(element, indexf, array){
              if(element.getIdentifier() == revokeRequestUser.userId ) {
               	 index = indexf;
              }
      });

      if(me.getFullyQualifiedType() === NAMESPACE_ORG) {
          meType = NAMESPACE_ORG;
      }

      else if(me.getFullyQualifiedType() === NAMESPACE_ENT) {
          meType = NAMESPACE_ENT;
      }

      else if(me.getFullyQualifiedType() === NAMESPACE_INS) {
          meType = NAMESPACE_INS;
      }

      if(index > -1) {
          me.requestUser.splice(index, 1);
          return getParticipantRegistry(meType)
          .then(function (typeRegistry) {
		      /*
              // emit an event
              var event = getFactory().newEvent(NAMESPACE_EVENT_OR_TRANSACTION, 'OrganizationEvent');
              event.txForOrg =  revokeRequestUser;
              emit(event);

              // persist the state of the member
               */
              return typeRegistry.update(me);
          });
      }
}

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}